import express from 'express';
import path from 'path';

const app = express();
const port = 4000;

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'output')));

// 404エラーページの設定
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'output', '404.html'));
});

// サーバーの起動
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});