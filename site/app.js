const forms = {
  maintenance: { title: 'نموذج طلب صيانة', prefix: 'M', fields: [['department','الإدارة أو المكتب','text',true],['requester','اسم الموظف أو المستخدم','text',true],['device_type','نوع الجهاز','text',true],['asset_number','الرقم التعريفي أو رقم الأصل','text',true],['issue_description','وصف العطل أو المشكلة','textarea',true],['request_date','تاريخ الطلب','date',true],['urgency','درجة الاستعجال','select',false],['maintenance_notes','ملاحظات فريق الصيانة','textarea',false]] },
  external: { title: 'نموذج إحالة إلى صيانة خارجية', prefix: 'E', fields: [['device_details','بيانات الجهاز','textarea',true],['fault_description','وصف العطل','textarea',true],['inspection_result','نتيجة الفحص الداخلي','textarea',true],['internal_repair_reason','سبب تعذر الإصلاح داخل المركز','textarea',true],['proposed_vendor','الجهة المقترح الإحالة إليها','text',true],['required_work_parts','الأعمال أو قطع الغيار المطلوبة','textarea',true],['referral_date','تاريخ الإحالة','date',true],['followup_notes','ملاحظات المتابعة','textarea',false],['official_approval','اعتماد المسؤول المختص','text',false]] }
};

const type = document.body.dataset.formType === 'external' ? 'external' : 'maintenance';
const fieldBox = document.querySelector('#fields');

function numberForCurrentForm() {
  const key = `gic-form-number-${type}`;
  let number = localStorage.getItem(key);
  if (!number) {
    number = `${forms[type].prefix}-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${String(Date.now()).slice(-5)}`;
    localStorage.setItem(key, number);
  }
  return number;
}

function render() {
  const spec = forms[type];
  document.querySelector('#page-title').textContent = spec.title;
  document.querySelector('#form-title').textContent = spec.title;
  document.querySelector('#form-number').textContent = numberForCurrentForm();
  document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.type === type));
  fieldBox.replaceChildren(...spec.fields.map(([name, label, kind, required]) => {
    const wrap = document.createElement('div');
    wrap.className = `field ${kind === 'textarea' ? 'field-wide' : ''}`;
    const labelEl = document.createElement('label'); labelEl.htmlFor = name; labelEl.textContent = label;
    if (required) { const mark = document.createElement('em'); mark.textContent = '*'; labelEl.append(mark); }
    let control;
    if (kind === 'textarea') { control = document.createElement('textarea'); control.rows = 4; }
    else if (kind === 'select') { control = document.createElement('select'); ['عادية','عاجلة','عاجلة جداً'].forEach(value => control.add(new Option(value, value))); }
    else { control = document.createElement('input'); control.type = kind; }
    control.id = control.name = name; control.required = required; wrap.append(labelEl, control);
    return wrap;
  }));
}

document.querySelector('#print').addEventListener('click', () => window.print());
function showNotice(message, isError = false) { const notice = document.querySelector('#notice'); notice.textContent = message; notice.hidden = false; notice.classList.toggle('notice-error', isError); }
function createPdfSheet() {
  const spec = forms[type], sheet = document.createElement('section'); sheet.className = 'pdf-export'; sheet.dir = 'rtl';
  sheet.innerHTML = `<div class="pdf-brand"><img src="logo.jpg" alt="شعار مركز الصناعة الخضراء"><div><b>مركز الصناعة الخضراء</b><span>وزارة الصناعة والمعادن</span></div></div><div class="pdf-title">${spec.title}</div><div class="pdf-number">رقم النموذج: ${numberForCurrentForm()}</div><div class="pdf-fields"></div>`;
  const fields = sheet.querySelector('.pdf-fields');
  spec.fields.forEach(([name, label]) => { const row = document.createElement('div'); row.className = 'pdf-row'; const labelEl = document.createElement('b'); labelEl.textContent = label; const valueEl = document.createElement('span'); valueEl.textContent = document.querySelector(`[name="${name}"]`).value || '—'; row.append(labelEl, valueEl); fields.append(row); });
  return sheet;
}
async function exportPdf() {
  const button = document.querySelector('#pdf');
  if (!window.html2canvas || !window.jspdf) return showNotice('تعذّر تحميل أداة PDF. تأكد من اتصال الإنترنت ثم أعد المحاولة.', true);
  button.disabled = true; button.textContent = 'جارٍ تجهيز PDF…'; const sheet = createPdfSheet(); document.body.append(sheet);
  try {
    const canvas = await window.html2canvas(sheet, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const { jsPDF } = window.jspdf, pdf = new jsPDF('p', 'mm', 'a4'); const width = 210, height = canvas.height * width / canvas.width, pageHeight = 297; let offset = 0;
    const image = canvas.toDataURL('image/jpeg', 0.96); pdf.addImage(image, 'JPEG', 0, offset, width, height);
    while (height + offset > pageHeight) { offset -= pageHeight; pdf.addPage(); pdf.addImage(image, 'JPEG', 0, offset, width, height); }
    pdf.save(`${numberForCurrentForm()}.pdf`); showNotice('تم تجهيز ملف PDF. ستجده في التنزيلات أو سيظهر خيار الحفظ في المتصفح.');
  } catch { showNotice('تعذّر إنشاء PDF في هذا المتصفح. افتح الرابط في Chrome ثم أعد المحاولة.', true); }
  finally { sheet.remove(); button.disabled = false; button.textContent = 'تصدير PDF'; }
}
document.querySelector('#pdf').addEventListener('click', exportPdf);
render();
