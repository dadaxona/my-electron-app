const urls = 'http://localhost:8989/'
const apiKeyKluch = 'http://94.230.232.179:1122/api/key/auth';
async function get_Face_Id() {
    const token = sessionStorage.getItem("token");
    const deviceAuth = sessionStorage.getItem('DeviceAuth')
    if (deviceAuth !== "true") {
        const res = await window.api.getDeviceApi({ token });
        if (res && res.statusCode === 200) {
            let arr = []
            res.items.forEach(e => {
                arr.push({
                    username: e.dataValues.username,
                    password: e.dataValues.password,
                    ip: e.dataValues.ip,
                    method: e.dataValues.method,
                })
            })
            sessionStorage.setItem("deviceData", JSON.stringify(arr))
            await getDeviceRespon();
        }
    } else {
        await getInterval_Fn()
    }
}

async function getInterval_Fn(){
    const online = '<span class="text-success">Online</span>';
    const offline = '<span class="text-danger">Offline</span>';
    const deviceData =  JSON.parse(sessionStorage.getItem('deviceData'));
    const deviceRespons =  JSON.parse(sessionStorage.getItem('deviceRespons'));
    const res = await axios.post(urls + 'intervalTime', {deviceData, deviceRespons});
    if (res && res.data.statusCode === 200) {
        sessionStorage.setItem("DeviceAuth", "true")
        $('.prose').html(online)
    } else {
        sessionStorage.setItem("DeviceAuth", "false")
        $('.prose').html(offline)
    }
}

async function getDeviceRespon() {
    const deviceData =  JSON.parse(sessionStorage.getItem('deviceData'));
    const res = await axios.post(urls + 'capabilities', {deviceData});
    if (res && res.data.statusCode === 200) {
        const online = '<span class="text-success">Online</span>';
        sessionStorage.setItem("deviceRespons", JSON.stringify(res.data.items))
        sessionStorage.setItem("DeviceAuth", "true")
        $('.prose').html(online)
    } else {
        const offline = '<span class="text-danger">Offline</span>';
        sessionStorage.setItem("DeviceAuth", "false")
        $('.prose').html(offline)
    }
}

function secondsToTime (totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return `${hh}:${mm}`;
}

async function getuserTime() {
    const countres = 136;
    const data = await window.api.setTimeApi({ time: 15 });
    if (data && data.statusCode === 300) {
        const token = sessionStorage.getItem("token");
        const res = await window.api.setusername({ token });
        if (res && res.statusCode === 200 && res.key && Number(res.key.length) === countres) {
            $('#derfgtyhujiklohads').modal('hide')
        } else {
            $('#derfgtyhujiklohads').modal('show')
        }
    } else {
        if (data && data.statusCode === 200) {
            if (data?.items?.count > data?.items?.count2) {
                const all = data?.items?.count - data?.items?.count2;
                const result = secondsToTime(all || 0)
                $('.tim').text("Demo tugash vaqti: " + result)
            }
        }
    }
}
getuserTime()
get_Face_Id()
setInterval(() => {
    getuserTime()
    get_Face_Id()
}, 15000);

$(document).on('click', '.openContact', async function () {
    $('#contactModal').modal('show')
    $('.cont').html(
        `
        <div class="modal-dialog w-100">
            <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0">
                <h5 class="modal-title w-100 text-center fw-bold text-primary">
                📞 Aloqa ma'lumotlari
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Yopish"></button>
            </div>
            <div class="modal-body p-4">
                <p class="mb-2"><strong>📱 Telefon</strong></p>
                <p class="text-muted small mb-1">+998 97 221 58 58</p>
                <p class="mb-2"><strong>✉️ Email</strong></p>
                <p class="text-muted small mb-3">idgroup5858@gmail.com</p>

                <p class="mb-2"><strong>⏰ Ish vaqti</strong></p>
                <p class="text-muted small mb-3">Dushanba — Shanba: 09:00 — 18:00</p>

                <div class="mt-4">
                <h6 class="mb-2 fw-semibold">Telegram</h6>
                <div class="d-flex gap-3">
                    <a class="social-btn" href="https://t.me/Ibadullayevich_Dilmurod" title="Telegram" aria-label="Telegram" target="_blank">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M9.999 15.17 9.93 19c.5 0 .72-.22.98-.48l2.34-2.25 4.85 3.52c.89.49 1.52.23 1.74-.82l3.15-14.79h.01c.28-1.35-.49-1.88-1.34-1.55L2.85 9.16c-1.31.52-1.29 1.27-.22 1.61l4.91 1.53 11.41-7.18c.54-.36 1.04-.16.63.22" fill="#0088cc"/>
                        </svg>
                    </a>
                </div>
                </div>

            </div>
            </div>
        </div>

        `
    )
})

$(document).on('click', '.svedata', async function () {
    const key = $('.savename').val()
    const respon = await axios.post(apiKeyKluch, {key})
    if (respon) {
        if (respon.data.statusCode === 200) {
            const token = sessionStorage.getItem("token");
            const result = await window.api.apiKeyKl({ token, key });
            if (result && result.statusCode === 200) {
                $('.errorkey').html('')
                $('#derfgtyhujiklohads').modal('hide')
                $('.savename').val('')
            }
        }
        if (respon.data.statusCode === 400) {
            $('.errorkey').html('Kluch eskirgan!')
        }
        if (respon.data.statusCode === 404) {
            $('.errorkey').html('Kluch topilmadi!')
        }
        if (respon.data.statusCode === 500) {
            $('.errorkey').html('Server bilan ulanishda muammo bor!')
        }
    }
    
})

function logaut() {
    sessionStorage.clear();
    $('#loginModal').modal('show');
    loadPage(lin || './dash.html');
}
const lin = sessionStorage.getItem('page')
async function loadPage(page) {
    const res = await fetch(page);
    const html = await res.text();
    document.querySelector('.spa').innerHTML = html;
    if (page.includes("dash.html")) {
        sessionStorage.setItem('page', './dash.html')
        dash()
    }
    if (page.includes("profil.html")) {
        sessionStorage.setItem('page', './profil.html')
        profiles()
    }
    if (page.includes("user.html")) {
        sessionStorage.setItem('page', './user.html')
        users()
    }
    if (page.includes("device.html")) {
        sessionStorage.setItem('page', './device.html')
        devices()
    }
    if (page.includes("smen.html")) {
        sessionStorage.setItem('page', './smen.html')
        smens()
    }
    if (page.includes("info.html")) {
        sessionStorage.setItem('page', './info.html')
    }
}

loadPage(lin || './dash.html');

function formate (totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return `${hh}:${mm}`;
}
$(document).on('click', '.clickbutton',  async function () {
    const username = $('#username').val();
    const password = $('#password').val();
    const res = await window.api.login(username, password);
    if (res && res.statusCode === 200) {
        sessionStorage.setItem('token', res.token)
        $('#loginModal').modal('hide')
        loadPage(lin || './dash.html');
        $('#username').val('');
        $('#password').val('');
    } else {
        console.log(res);
    }
});
async function dash() {
    $('.exbut').html(`<button class="btn btn-success exportDash">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
        <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
        </svg> Export</button>`)

    async function ver() {
        const token = sessionStorage.getItem("token");
        // if (!token) {
        //     $('#loginModal').modal('show')
        // } else {
        //     $('#loginModal').modal('hide')
        // }
        const res = await window.api.verifyToken({'token': token});
        console.log(res);
        if (!res || res.statusCode !== 200) {
            
            $('#loginModal').modal('show')
        } else {
            $('#loginModal').modal('hide')
        }
    }
    await ver()
    const todayData = new Date();
    const today = todayData.toISOString().split('T')[0];
    let page2 = 1, limit2 = 15, search2 = '', smenh='', date=today, date2='';
    let pageof = 1, limitof = 15;

    $(document).on('click', '.exportDash', async function () {
        const token = sessionStorage.getItem("token");
        const result = await window.api.exportExcelDash({ token, smenh, search2, date, date2 });        
        if (result && result.statusCode === 200) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Ism", key: "ism", width: 20 },
                { header: "Familiya", key: "fam", width: 20 },
                { header: "Sharif", key: "shar", width: 20 },
                { header: "Smen", key: "smen", width: 20 },
                { header: "Sana", key: "sana", width: 20 },
                { header: "Kirish", key: "kirish", width: 20 },
                { header: "Chiqish", key: "chiqish", width: 20 },
            ];
            result.items.forEach(row => worksheet.addRow({
                id: row.id,
                ism: row.ism,
                fam: row.fam,
                shar: row.shar,
                smen: row.smen,
                sana: row.sana,
                kirish: formate(row.kirish || 0),
                chiqish: formate(row.chiqish || 0)
            }));
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Kelganlar.xlsx";
            link.click();
        } else {
            console.log(result);
        }
    })

    $(document).on('click', '.exportKechqolgan', async function () {
        const token = sessionStorage.getItem("token");
        const result = await window.api.exportExcelCon({ token, smenh, search2, date, date2 });
        if (result && result.statusCode === 200) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Ism", key: "ism", width: 20 },
                { header: "Familiya", key: "fam", width: 20 },
                { header: "Sharif", key: "shar", width: 20 },
                { header: "Smen", key: "smen", width: 20 },
                { header: "Sana", key: "sana", width: 20 },
                { header: "Kirish", key: "kirish", width: 20 },
                { header: "Chiqish", key: "chiqish", width: 20 },
            ];
            result.items.forEach(row => worksheet.addRow({
                id: row.id,
                ism: row.ism,
                fam: row.fam,
                shar: row.shar,
                smen: row.smen,
                sana: row.sana,
                kirish: formate(row.kirish || 0),
                chiqish: formate(row.chiqish || 0)
            }));
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Kechqolganlar.xlsx";
            link.click();
        } else {
            console.log(result);
        }
    })

    $(document).on('click', '.kelmaag', async function () {
        $('.exbut').html(`<button class="btn btn-danger px-4 exportKelma">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
            <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg> Export</button>`)
        const token = sessionStorage.getItem("token");
        const res = await window.api.getMijozApi({ token });
        if (res && res.statusCode === 200) {
            html_fn4(res.items)
        } else {
        console.log(res);
    }
    })

    $(document).on('click', '.exportKelma', async function () {
        const token = sessionStorage.getItem("token");
        const result = await window.api.exportExcelKelma({ token });
        if (result && result.statusCode === 200) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Ism", key: "ism", width: 20 },
                { header: "Familiya", key: "fam", width: 20 },
                { header: "Sharif", key: "shar", width: 20 },
                { header: "Smen", key: "smen", width: 20 },
                { header: "Kirish", key: "kirish", width: 20 },
                { header: "Chiqish", key: "chiqish", width: 20 },
            ];
            result.items.forEach(row => worksheet.addRow({
                id: row.id,
                ism: row.ism,
                fam: row.fam,
                shar: row.shar,
                smen: row.Smen.smen,
                kirish: formate(row.kirish || 0),
                chiqish: formate(row.chiqish || 0)
            }));
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Kelmagan.xlsx";
            link.click();
        } else {
            console.log(result);
        }
    })

    function html_fn4(params) {        
        let item = ''
        params.forEach(e => {
            item += `
                <tr>
                    <td>
                        ${e?.rasm 
                            ? `<img src="../../uploads/${e?.rasm}" style="width: 40px; height: 50px;">` 
                        : ""}
                    </td>
                    <td>${e?.ism || ''}</td>
                    <td>${e?.fam || ''}</td>
                    <td>${e?.shar || ''}</td>
                    <td>${e?.Smen?.smen || ''}</td>
                    <td>${e?.date || ''}</td>
                    <td>${formate(e?.kirish || 0) || ''}</td>
                    <td>${formate(e?.chiqish || 0) || ''}</td>
                </tr>
            `
        });
        $(".tdash").html(item);
        $('.count').html(params.length)
    }

    $(document).on('click', '.kechqolgan', async function () {
        pageof = 1
        limitof = 15
        await ofCanvast(pageof, limitof)
    })

    $(document).on('click', '.delof', async function () {
        const id = $(this).data("id")
        const res = await window.api.conrtolDelete({ token, id })
        if (res && res.statusCode === 200) {
            await ofCanvast(pageof, limitof)
            await getAllData()
        } else {
            console.log(res);
        }
    })
    
    async function ofCanvast(pageof, limitof) {
        const token = sessionStorage.getItem("token");
        const res = await window.api.getConrtolApi({ token, page: pageof, limit: limitof });
        if (res && res.statusCode === 200) {
            html_fn3(res.items)
        } else {
            console.log(res);
        }
    }

    $(document).on('click', '.Previousof', async function () {
        pageof--
        if (pageof <= 0) {
            pageof = 1
        } else {
            await ofCanvast(pageof, limitof)
        }
    })

    $(document).on('click', '.Nextof', async function () {
        pageof++
        await ofCanvast(pageof, limitof)
    })

    function html_fn3(params) {
        $('.pagof').html(pageof)
        let item = ''
        params.forEach(e => {
            item += `
                <tr>
                    <td>
                        ${e?.Mijoz?.rasm 
                            ? `<img src="../../uploads/${e?.Mijoz?.rasm}" style="width: 40px; height: 50px;">` 
                        : ""}
                    </td>
                    <td>${e?.ism || ''}</td>
                    <td>${e?.fam || ''}</td>
                    <td>${e?.shar || ''}</td>
                    <td>${e?.smen || ''}</td>
                    <td>${e?.sana || ''}</td>
                    <td>${formate(e?.kirish) || ''}</td>
                    <td>${formate(e?.chiqish || 0) || ''}</td>
                    <td>
                     <span class="delof text-danger" data-id="${e?.id}" style="cursor: pointer;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                     </span>
                    </td>
                </tr>
            `
        });
        $(".tdashof").html(item);
        $('.countof').html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
            <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg> Export: ` + params.length)
    }

    $(document).on('click', '.clr', async function () {
        date=today
        $('#date').val('')
        $('#date2').val('')
        $('#smenh').val('')
        $('#search2').val('')
        await getAnaliz()
    })
    
    $(document).on('change', '#date', async function () {
        date = $(this).val()
        await getAnaliz2(page2, limit2, search2, smenh, date, date2)
    })

    $(document).on('change', '#date2', async function () {
        date2 = $(this).val()
        await getAnaliz2(page2, limit2, search2, smenh, date, date2)
    })

    $(document).on('change', '#smenh', async function () {
        smenh = $(this).val()
        await getAnaliz2(page2, limit2, search2, smenh, date, date2)
    })

    $(document).on('keyup', '#search2', async function () {
        search2 = $(this).val()
        await getAnaliz2(page2, limit2, search2, smenh, date, date2)
    })
    
    $(document).on('click', '.Previous2', async function () {
        page2--
        if (page2 <= 0) {
            page2 = 1
        } else {
            await getAnaliz2(page2, limit2, search2, smenh, date, date2)
        }
    })
    $(document).on('click', '.Next2', async function () {
        page2++
        await getAnaliz2(page2, limit2, search2, smenh, date, date2)
    })

    async function getAnaliz2(page2, limit2, search2, smenh, date, date2) {
        $('.pag2').html(page2)
        const token = sessionStorage.getItem("token");
        const res = await window.api.getAnalizApi({ token, page2, limit2, search2, smenh, date, date2 });
        if (res && res.statusCode === 200) {
            await getAllData()
            html_fn2(res.items)
        } else {
            console.log(res);
        }
    }

    async function getAllData() {
        const token = sessionStorage.getItem("token");
        const result = await window.api.getAllApi({'token': token, smenh, date, date2 })
        if (result && result.statusCode === 200) {
            $('.jami').html(result.items.mijoz)
            $('.kelgan').html(result.items.analiz)
            $('.kechikish').html(result.items.control)
            $('.kelmagan').html(result.items.kelmagan)
        } else {
            console.log(result);
        }
    }

    async function getAnaliz() {
        const token = sessionStorage.getItem("token");
        const res = await window.api.getAnalizApi({ token, page2, limit2, date });
        if (res && res.statusCode === 200) {
            await getAllData()
            html_fn2(res.items)
        }
    }

    function html_fn2(params) {
        let item = ''
        params.forEach(e => {
            item += `
                <tr>
                    <td>
                        ${e?.Mijoz?.rasm 
                            ? `<img src="../../uploads/${e?.Mijoz?.rasm}" style="width: 40px; height: 50px;">` 
                        : ""}
                    </td>
                    <td>${e?.ism || ''}</td>
                    <td>${e?.fam || ''}</td>
                    <td>${e?.shar || ''}</td>
                    <td>${e?.smen || ''}</td>
                    <td>${e?.sana || ''}</td>
                    <td>${formate(e?.kirish || 0) || ''}</td>
                    <td>${formate(e?.chiqish || 0) || ''}</td>
                </tr>
            `
        });
        $(".tdash").html(item);
        $('.count').html(params.length)
        $('.exbut').html(`<button class="btn btn-success px-4 exportDash">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
            <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg> Export</button>`)
    }
    await getAnaliz();
}

async function profiles() {
    async function getProfil() {
        const token = sessionStorage.getItem("token");
        const res = await window.api.getProfilApi({ token });
        if (res && res.statusCode === 200) {
            document.getElementById("id").value = res.items.id;
            document.getElementById("username").value = res.items.username;
            document.getElementById("password").value = res.items.password;
        } else {
            console.log(res);
        }
    }

    const updateForm = document.getElementById("updateForm");
    const deleteBtn = document.getElementById("deleteBtn");

    // Profil yangilash
    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("id").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const token = sessionStorage.getItem("token");
        const res = await window.api.updateProfile({ token, id, username, password });
        if (res && res.statusCode === 200) {
            logaut()
        } else {
            console.log(res);
        }
    });

    // Profil o‘chirish
    deleteBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete your account?")) {
            const token = sessionStorage.getItem("token");
            const res = await window.api.deleteProfile({ token });
            if (res && res.statusCode === 200) {
                alert("Account deleted 🗑️");
                sessionStorage.clear();
                logaut()
            } else {
                console.log(res);
                alert("Delete failed ❌");
            }
        }
    });
    await getProfil();
}

async function devices() {
    const addDevice = document.getElementById("addDevice")
    async function getDevise() {
        const token = sessionStorage.getItem("token");
        const res = await window.api.getDeviceApi({ token });
        if (res && res.statusCode === 200) {
            let item = ''
            res.items.forEach(e => {
                item += `
                    <tr>
                        <td>${e.dataValues.username}</td>
                        <td>${e.dataValues.password}</td>
                        <td>${e.dataValues.ip}</td>
                        <td>${e.dataValues.method}</td>
                        <td>
                            <button class="btn btn-sm btn-warning me-1" 
                            id="editDevice" 
                            data-id="${e.dataValues.id}"
                            data-username="${e.dataValues.username}"
                            data-password="${e.dataValues.password}"
                            data-ip="${e.dataValues.ip}"
                            data-method="${e.dataValues.method}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                            </button>
                            <button class="btn btn-sm btn-danger" 
                            id="deleteDevice" data-id="${e.dataValues.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                `
            });
            document.getElementById("tbodyD").innerHTML = item;
        } else {
            console.log(res);
        }
    }

    addDevice.addEventListener("click", async () =>  {
        const idD = document.getElementById("idD").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const ip = document.getElementById("ip").value;
        const method = document.getElementById("method").value;
        const token = sessionStorage.getItem("token");
        if (!username || !password || !ip || !method) {
            alert("Barcha maydonlarni to'ldiring!");
            return;
        }
        const res = idD ? 
            await window.api.updateDevice({ token, id: idD, username, password, ip, method }) :
            await window.api.createDevice({ token, username, password, ip, method });
        if (res && res.statusCode === 200) {
            document.getElementById("idD").value = '';
            document.getElementById("username").value = '';
            document.getElementById("password").value = '';
            document.getElementById("ip").value = '';
            document.getElementById("method").value = '';
            await getDevise()
        } else {
            console.log(res);
        }
    })

    $(document).on('click', '#editDevice', function () {
        $('#idD').val($(this).data('id') || '')
        $('#username').val($(this).data('username') || '')
        $('#password').val($(this).data('password') || '')
        $('#ip').val($(this).data('ip') || '')
        $('#method').val($(this).data('method') || '')
    })

    $(document).on('click', '#deleteDevice', async function () {
        const token = sessionStorage.getItem("token");
        const id = $(this).data('id')
        const res = await window.api.deleteDevice({ token, id });
        console.log(res);
        if (res && res.statusCode === 200) {
            await getDevise()
        } else {
            console.log(res);
        }
    })
    await getDevise()
}

async function smens() {
    const addSmen = document.getElementById("addSmen")
    async function getSmen() {
        const token = sessionStorage.getItem("token");
        const res = await window.api.getSmenApi({ token });
        if (res && res.statusCode === 200) {
            let item = ''
            res.items.forEach(e => {
                item += `
                    <tr>
                        <td>${e.dataValues.smen}</td>
                        <td>${e.dataValues.kirish}</td>
                        <td>${e.dataValues.chiqish}</td>
                        <td>
                            <button class="btn btn-sm btn-warning me-1" 
                            id="editSmen" 
                            data-id="${e.dataValues.id}"
                            data-smen="${e.dataValues.smen}"
                            data-kirish="${e.dataValues.kirish}"
                            data-chiqish="${e.dataValues.chiqish}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                            </button>
                            <button class="btn btn-sm btn-danger" 
                            id="deleteSmen" data-id="${e.dataValues.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                `
            });
            document.getElementById("tbodyS").innerHTML = item;
        } else {
            console.log(res);
        }
    }

    addSmen.addEventListener("click", async () => {
        const idS = document.getElementById("idS").value;
        const smen = document.getElementById("smen").value;
        const kirish = document.getElementById("kirish").value;
        const chiqish = document.getElementById("chiqish").value;
        const token = sessionStorage.getItem("token");
        if (!smen || !kirish || !chiqish) {
            alert("Barcha maydonlarni to'ldiring!");
            return;
        }
        const res = idS ? 
            await window.api.updateSmen({ token, id: idS, smen, kirish, chiqish }) :
            await window.api.createSmen({ token, smen, kirish, chiqish });
        if (res && res.statusCode === 200) {
            document.getElementById("idS").value = '';
            document.getElementById("smen").value = '';
            document.getElementById("kirish").value = '';
            document.getElementById("chiqish").value = '';
            await getSmen()
        } else {
            console.log(res);
        }
    })

    $(document).on('click', '#editSmen', function () {
        $('#idS').val($(this).data('id') || '')
        $('#smen').val($(this).data('smen') || '')
        $('#kirish').val($(this).data('kirish') || '')
        $('#chiqish').val($(this).data('chiqish') || '')
    })

    $(document).on('click', '#deleteSmen', async function () {
        const token = sessionStorage.getItem("token");
        const id = $(this).data('id')
        const res = await window.api.deleteSmen({ token, id });
        if (res && res.statusCode === 200) {
            await getSmen()
        } else {
            console.log(res);
        }
    })
    await getSmen()
}

async function users() {
    const addUser = document.getElementById("addUser")
    async function getSm() {
        const token = sessionStorage.getItem("token");
        const res = await window.api.getSmenApi({ token });
        if (res && res.statusCode === 200) {
            let item = ''
            item += `<option value="">--Tanlang--</option>`;
            res.items.forEach(e => {
                item += `
                    <option value="${e.dataValues.id}">${e.dataValues.smen}</option>
                `
            });
            $(".sm").html(item);
        } else {
            console.log(res);
        }
    }
    let page = 1, limit = 15, search = '';

    $(document).on('keyup', '#search', async function () {
        search = $(this).val()
        await getUsers2(page, limit, search)
    })

    $(document).on('click', '.exportUser', async function () {
        const token = sessionStorage.getItem("token");
        const result = await window.api.exportExcel({ token });
        if (result && result.statusCode === 200) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Ism", key: "ism", width: 20 },
                { header: "Familiya", key: "fam", width: 20 },
                { header: "Sharif", key: "shar", width: 20 },
                { header: "Smen", key: "smen", width: 20 },
            ];
            result.items.forEach(row => worksheet.addRow({
                ...row,
                smen: row.Smen.smen
            }));
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Xodimlar.xlsx";
            link.click();
        } else {
            console.log(result);
        }
    })

    async function getUsers() {
        $('.pag').html(page)
        await getSm()
        const token = sessionStorage.getItem("token");
        const res = await window.api.getUserApi({ token, page, limit, search });
        if (res && res.statusCode === 200) {
            html_fn(res.items)
        } else {
            console.log(res);
        }
    }

    async function getUsers2(page, limit, search) {
        $('.pag').html(page)
        const token = sessionStorage.getItem("token");
        const res = await window.api.getUserApi({ token, page, limit, search });
        if (res && res.statusCode === 200) {
            html_fn(res.items)
        } else {
            console.log(res);
        }
    }

    function html_fn(params) {
        let item = ''
        params.forEach(e => {
            item += `
                <tr>
                    <td>
                        ${e.rasm 
                            ? `<img src="../../uploads/${e.rasm}" style="width: 40px; height: 50px;">` 
                            : ""}
                    </td>
                    <td>${e.ism}</td>
                    <td>${e.fam}</td>
                    <td>${e.shar}</td>
                    <td>${e.Smen.smen}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" 
                        id="editUser"
                        data-id="${e.id}"
                        data-ism="${e.ism}"
                        data-fam="${e.fam}"
                        data-shar="${e.shar}"
                        data-smen="${e.Smen.id}"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-danger" 
                        id="deleteUser" data-id="${e.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `
        });
        document.getElementById("tbodyM").innerHTML = item;
    }

    $(document).on('click', '.Previous', async function () {
        page--
        if (page <= 0) {
            page = 1
        } else {
            await getUsers2(page, limit, search)
        }
    })
    $(document).on('click', '.Next', async function () {
        page++
        await getUsers2(page, limit, search)
    })

    addUser.addEventListener("click", async () => {
        await getInterval_Fn()
        const idM = document.getElementById("idM").value;
        const ism = document.getElementById("ism").value;
        const fam = document.getElementById("fam").value;
        const shar = document.getElementById("shar").value;
        const smen = document.getElementById("smen").value;
        const fileInput = document.getElementById("rasm");
        const token = sessionStorage.getItem("token");

        if (!ism || !fam || !shar || !smen) {
            alert("Barcha maydonlarni to'ldiring!");
            return;
        }
        if (fileInput.files.length > 0) {
            const deviceAuth = sessionStorage.getItem('DeviceAuth')
            if (deviceAuth === "true") {
                const payload = { token, id: idM, ism, fam, shar, smen };
                const res = idM
                ? await window.api.updateUser(payload)
                : await window.api.createUser(payload);
                if (res && res.statusCode === 200) {
                    if (res.items.dataValues.id) {
                        const deviceData =  JSON.parse(sessionStorage.getItem('deviceData'));
                        const deviceRespons =  JSON.parse(sessionStorage.getItem('deviceRespons'));
                        const formData = new FormData();
                        formData.append("image", fileInput.files[0]);
                        formData.append("employeeNo", res.items.dataValues.id);
                        formData.append("name", res.items.dataValues.ism);
                        formData.append("deviceData", JSON.stringify(deviceData));
                        formData.append("deviceRespons", JSON.stringify(deviceRespons));
                        const respon = await axios.post(
                            urls + (idM ? 'update_img' : 'uplode_img'),
                            formData, { headers: { "Content-Type": "multipart/form-data" } }
                        );
                        if (respon && respon.data.statusCode === 200) {
                            clears()
                            await getUsers();
                        }
                    }
                } else {
                    console.log(res);
                }
            }
        } else {
            const deviceAuth = sessionStorage.getItem('DeviceAuth')
            if (deviceAuth === "true") {
                const payload = { token, id: idM, ism, fam, shar, smen };
                const res = idM
                ? await window.api.updateUser(payload)
                : await window.api.createUser(payload);
                if (res && res.statusCode === 200) {
                    clears()
                    await getUsers();
                } else {
                    console.log(res);
                }
            }
        }
    });

    function clears() {
        document.getElementById("idM").value = "";
        document.getElementById("ism").value = "";
        document.getElementById("fam").value = "";
        document.getElementById("shar").value = "";
        document.getElementById("smen").value = "";
        document.getElementById("rasm").value = "";
    }

    $(document).on('click', '#editUser', function () {
        $('#idM').val($(this).data('id') || '')
        $('#ism').val($(this).data('ism') || '')
        $('#fam').val($(this).data('fam') || '')
        $('#shar').val($(this).data('shar') || '')
        $('#smen').val($(this).data('smen') || '')
    })

    $(document).on('click', '#deleteUser', async function () {
        await getInterval_Fn()
        const token = sessionStorage.getItem("token");
        const id = $(this).data('id')
        const deviceAuth = sessionStorage.getItem('DeviceAuth')
        if (deviceAuth === "true") {
            const deviceData = JSON.parse(sessionStorage.getItem('deviceData'));
            const deviceRespons = JSON.parse(sessionStorage.getItem('deviceRespons'));
            const respon = await axios.post(urls + 'deleteUserDevice', {employeeNo: id, deviceData, deviceRespons})
            if (respon.data.statusCode === 200) {
                const res = await window.api.deleteUser({ token, id });
                if (res && res.statusCode === 200) {
                    await getUsers()
                } else {
                    console.log(res);
                }
            } else {
                console.log(respon);
            }
        }
    })
    await getUsers()
}