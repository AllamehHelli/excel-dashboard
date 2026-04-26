document.getElementById('upload').addEventListener('change', handleFile, false);

function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // تبدیل اکسل به فرمت JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        renderDashboard(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function renderDashboard(data) {
    // ۱. محاسبات دقیق (مثلاً جمع کل فروش یا میانگین)
    const labels = data.map(item => item.Month); // فرض کنید ستونی به نام Month دارید
    const values = data.map(item => item.Sales); // فرض کنید ستونی به نام Sales دارید

    // ۲. رسم نمودار
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'فروش ماهانه',
                data: values,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        }
    });

    // ۳. ساخت جدول
    let table = document.getElementById('dataTable');
    table.innerHTML = `<thead class="bg-gray-50"><tr><th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ماه</th><th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">مبلغ</th></tr></thead>`;
    data.forEach(item => {
        table.innerHTML += `<tr><td class="px-6 py-4">${item.Month}</td><td class="px-6 py-4">${item.Sales.toLocaleString()}</td></tr>`;
    });
}
