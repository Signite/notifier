import got from 'got';
import fs from 'fs';

async function run() {
    const startTime = Date.now();
    console.log('Start test at', new Date(startTime));

    const reqBody = {
        message: {
            text: "Test common text",
            telegram: {
                type: "Markdown",
                content: "___2342___"
            },
            email: {
                from: "Ваш Нотификатор!<stanislav.s.ostrin@tplusgroup.ru>",
                html: `<p>Сообщение отправлено новой версией нотификатора. Обновленная документация во вложении к письму (README.MD)</p><h3>Hello<h3></br><h2>My<h2></br><h1>World!<h1><img src="cid:logo" width="500" height="300"/>`,
                subject: "Что-то срочное!",
                splitLetters: false
            }
        },
        attachments: [],
        emails: [],
        telegrams: [],
        groups: ["g1"]
    }

    reqBody.attachments.push({ data: fs.readFileSync('./some1.txt', 'base64'), type: "document", name: "some1.txt", caption: "Текстовый файл" });
    reqBody.attachments.push({ data: fs.readFileSync('./imageFile.jpg', 'base64'), type: "image", name: "imageFile.jpg", cid: 'logo' });
    reqBody.attachments.push({ data: fs.readFileSync('./someWord.docx', 'base64'), type: "document", name: "someWord.docx", caption: "Вордфайл" });
    reqBody.attachments.push({ data: fs.readFileSync('./someWord.pdf', 'base64'), type: "document", name: "someWord.pdf", caption: "Какой-то ПДФ" });
    reqBody.attachments.push({ data: fs.readFileSync('../../README.MD', 'base64'), type: "document", name: "README.MD", caption: "Описание АПИ" });

    const response = await got.post('http://localhost:3003/api/v2/notify', {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Basic LOGIN:PASSWORD"
        },
        body: JSON.stringify(reqBody)
    })

    console.log(response.statusCode);
    if (response.statusCode === 200) {
        console.log(response.body);
    }

    const endTime = Date.now();
    console.log('Test end at', new Date(endTime), '. Test spend -', (endTime - startTime) / 1000, 'seconds');

}

run();