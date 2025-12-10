const { Op } = require("sequelize");
const { Analiz, Control, Mijoz, Admin, Smen } = require('../../models/index.js');
class HelpControl {
    dateTime () {
        const todayData = new Date();
        const today = todayData.toISOString().split('T')[0];
        const times = todayData.toLocaleTimeString("uz-UZ", { timeZone: "Asia/Tashkent", hour12: false });
        const [clock, minut, secound] = times.split(':')
        const [yyyy, mm, dd] = today.split('-')
        const time = `${clock}:${minut}`
        return {today, yyyy, mm, dd, time}
    }
    async createOrupdate (employeeNo) {
        try {
        const { today, time } = this.dateTime();
        const result = await Mijoz.findOne({
            where: {id: Number(employeeNo)},
            include: [
                {
                    model: Admin
                },
                {
                    model: Smen
                }
            ]
        })
        if (result) {
            const mijoz = result.toJSON()
            const smen = mijoz.Smen.smen;
            if (smen === 'Kun') {
                const results2 = await Analiz.findOne({
                    order: [['id', 'DESC']],
                    where: { mijozId: Number(mijoz.id), sana: String(today) }
                });
                if (results2) {
                    if (results2.kirish && results2.chiqish) {
                        return await this.create2(employeeNo)
                    }
                    if (results2.kirish) {
                        return await this.update2(employeeNo)
                    }
                } else {
                    return await this.create2(employeeNo)
                }
            }
            if (smen === "Tun" || smen === "To'liq") {
                const tu = new Date();
                const yesterday = new Date(tu);
                yesterday.setDate(tu.getDate() - 1);
                const date = yesterday.toISOString().split('T')[0];
                const results3 = await Analiz.findOne({
                    order: [['id', 'DESC']],
                    where: { mijozId: Number(mijoz.id), sana: String(today) }
                });
                if (results3) {
                    if (results3.kirish && results3.chiqish) {
                        return await this.create2(employeeNo)
                    }
                    if (results3.kirish) {
                        return await this.update2(employeeNo)
                    }
                } else {
                    const results4 = await Analiz.findOne({
                        order: [['id', 'DESC']],
                        where: { mijozId: Number(mijoz.id), sana: String(date) }
                    });
                    if (results4) {
                        if (results4.kirish && results4.chiqish) {
                            return await this.create2(employeeNo)
                        }
                        if (results4.kirish) {
                            return await this.update2(employeeNo)
                        }
                    } else {
                        return await this.create2(employeeNo)
                    }
                }
            }
        }
        return;
        } catch (error) {
            return;
        }
    }
    async create2 (employeeNo) {
        try {
            const result = await Mijoz.findOne({
            where: {id: Number(employeeNo)},
            include: [
                {
                    model: Admin
                },
                {
                    model: Smen
                }
            ]
        })
        const { today, time } = this.dateTime();
        if (result) {
            result.date = String(today);
            await result.save()

            const mijoz = result.toJSON()
            const stafftime2 = mijoz.Smen.kirish;
            const [staffsoat, staffminut] = stafftime2.split(":").map(Number);
            const [realsoat, realminut] = time.split(":").map(Number);

            let stafftugash = staffsoat * 3600 + staffminut * 60;
            let realtime = realsoat * 3600 + realminut * 60;
            const check = realtime > stafftugash ? true : false;

            if (check) {
                await Control.create({
                    adminId: mijoz.Admin.id,
                    mijozId: mijoz.id,
                    ism: mijoz.ism,
                    fam: mijoz.fam,
                    shar: mijoz.shar,
                    smen: mijoz.Smen.smen,
                    a1: mijoz.Smen.kirish,
                    a2: mijoz.Smen.chiqish,
                    kirish: realtime,
                    sana: today
                })
            }

            await Analiz.create({
                adminId: mijoz.Admin.id,
                mijozId: mijoz.id,
                ism: mijoz.ism,
                fam: mijoz.fam,
                shar: mijoz.shar,
                smen: mijoz.Smen.smen,
                a1: mijoz.Smen.kirish,
                a2: mijoz.Smen.chiqish,
                kirish: realtime,
                sana: today
            })
        }
        return;
        } catch (error) {
            return;
        }
    }

    async update2 (employeeNo) {
        try {
            const result = await Mijoz.findOne({
            where: {id: Number(employeeNo)},
            include: [
                {
                    model: Admin
                },
                {
                    model: Smen
                }
            ]
        })
        if (result) {
            const mijoz = result.toJSON()
            const { today, time } = this.dateTime();

            const smen = mijoz.Smen.smen;
            const stafftime2 = mijoz.Smen.chiqish;
            const [staffsoat, staffminut] = stafftime2.split(":").map(Number);
            const [realsoat, realminut] = time.split(":").map(Number);

            let stafftugash = staffsoat * 3600 + staffminut * 60;
            let realtime = realsoat * 3600 + realminut * 60;

            if (smen === "Kun") {
                const results2 = await Analiz.findOne({
                    order: [['id', 'DESC']],
                    where: { mijozId: Number(mijoz.id), sana: String(today) }
                });
                if (results2) {
                    const check = realtime < stafftugash ? true : false;
                    if (check) {
                        await Control.create({
                            adminId: mijoz.Admin.id,
                            mijozId: mijoz.id,
                            ism: mijoz.ism,
                            fam: mijoz.fam,
                            shar: mijoz.shar,
                            smen: mijoz.Smen.smen,
                            a1: mijoz.Smen.kirish,
                            a2: mijoz.Smen.chiqish,
                            chiqish: realtime,
                            sana: today
                        })
                    }
                    results2.chiqish = realtime;
                    await results2.save();
                }
            }
            if (smen === "Tun" || smen === "To'liq") {
                const tu = new Date();
                const yesterday = new Date(tu);
                yesterday.setDate(tu.getDate() - 1);
                const date = yesterday.toISOString().split('T')[0];
                const results3 = await Analiz.findOne({
                    order: [['id', 'DESC']],
                    where: { mijozId: Number(mijoz.id), sana: String(date) }
                });                
                if (results3) {
                    const check = realtime < stafftugash ? true : false;
                    if (check) {
                        await Control.create({
                            adminId: mijoz.Admin.id,
                            mijozId: mijoz.id,
                            ism: mijoz.ism,
                            fam: mijoz.fam,
                            shar: mijoz.shar,
                            smen: mijoz.Smen.smen,
                            a1: mijoz.Smen.kirish,
                            a2: mijoz.Smen.chiqish,
                            chiqish: realtime,
                            sana: today
                        })
                    }
                    results3.chiqish = realtime;
                    await results3.save();
                } else {
                    const results4 = await Analiz.findOne({
                        order: [['id', 'DESC']],
                        where: { mijozId: Number(mijoz.id), sana: String(today) }
                    });
                    if (results4) {
                        const check = realtime < stafftugash ? true : false;
                        if (check) {
                            await Control.create({
                                adminId: mijoz.Admin.id,
                                mijozId: mijoz.id,
                                ism: mijoz.ism,
                                fam: mijoz.fam,
                                shar: mijoz.shar,
                                smen: mijoz.Smen.smen,
                                a1: mijoz.Smen.kirish,
                                a2: mijoz.Smen.chiqish,
                                chiqish: realtime,
                                sana: today
                            })
                        }
                        results4.chiqish = realtime;
                        await results4.save();
                    }
                }
            }
        }
        return;
        } catch (error) {
            return;
        }
    }

    async create (employeeNo) {
        try {
            const result = await Mijoz.findOne({
                where: {id: Number(employeeNo)},
                include: [
                    {
                        model: Admin
                    }
                ]
            })        
            const { today, time } = this.dateTime();
            // if (result && result.date !== String(today)) {
            if (result) {
                result.date = String(today);
                await result.save()
                const mijoz = result.toJSON()
                const [realsoat, realminut] = time.split(":").map(Number);
                let realtime = realsoat * 3600 + realminut * 60;
                await Analiz.create({
                    adminId: mijoz.Admin.id,
                    mijozId: mijoz.id,
                    ism: mijoz.ism,
                    fam: mijoz.fam,
                    shar: mijoz.shar,
                    kirish: realtime,
                    sana: today
                })
            }
            return;
        } catch (error) {
            return
        }
    }

    async update (employeeNo) {
       try {
         const result = await Mijoz.findOne({
            where: {id: Number(employeeNo)},
            include: [
                {
                    model: Admin
                }
            ]
        })
        if (result) {
            const mijoz = result.toJSON()
            const { today, time } = this.dateTime();
            const [realsoat, realminut] = time.split(":").map(Number);
            let realtime = realsoat * 3600 + realminut * 60;
            const results3 = await Analiz.findOne({
                order: [['id', 'DESC']],
                where: { mijozId: Number(mijoz.id) }
            });
            if (results3) {
                results3.chiqish = realtime;
                await results3.save();
            }
        }
        return;
       } catch (error) {
        return;
       }
    }

    option (query, token) {
        let where = {};
        if (token) {
            where.adminId = Number(token.id)
        }
        // if (query.smenh) {
        //     where.smen = query.smenh;
        // }
        if (query.search2) {
            where[Op.or] = [
                { ism: { [Op.like]: `%${query.search2}%` } },
                { fam: { [Op.like]: `%${query.search2}%` } },
                { shar: { [Op.like]: `%${query.search2}%` } },
            ];
        }
        if (query.date) {
            if (query.date2) {
                where.sana = { [Op.between]: [query.date, query.date2] };
            } else {
                where.sana = query.date;
            }
        }
        return { where };
    }
}
module.exports = HelpControl;