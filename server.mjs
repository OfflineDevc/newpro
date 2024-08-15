import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const OPENAI_API_KEY = 'KEYY HEREEE';

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are Saman, the best adviser in the world in Thai law and you are Thai." },
                    { role: "user", content: userMessage }
                ]
            }),
            timeout: 10000 // เพิ่มเวลารอสูงสุด (10 วินาที) สำหรับการเชื่อมต่อ
        });

        if (!gptResponse.ok) {
            const errorText = await gptResponse.text();
            throw new Error(`OpenAI API error: ${errorText}`);
        }

        const gptData = await gptResponse.json();
        console.log('GPT Data:', gptData);

        if (gptData.choices && gptData.choices.length > 0) {
            const reply = gptData.choices[0].message.content;
            res.json({ reply });
        } else {
            throw new Error('Invalid response format from OpenAI');
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ reply: 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
