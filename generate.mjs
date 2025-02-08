import { marked } from 'marked';
import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';
import matter from 'gray-matter'; // gray-matterをインポート

// outputフォルダを削除（存在する場合）
if (fs.existsSync('output')) {
    fs.removeSync('output');
    console.log('outputフォルダを削除しました。');
}

// outputフォルダを新たに作成
fs.ensureDirSync('output');
console.log('outputフォルダを作成しました。');

// assetsフォルダをoutputにコピー
fs.copySync('assets', 'output/assets');

// コンテンツをMarkdownからHTMLに変換
function convertMarkdownToHtml(filePath) {
    const markdownText = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(markdownText); // Markdownファイルのフロントマターを解析
    const markdownContent = marked(parsed.content); // Markdown本文をHTMLに変換
    return { content: markdownContent, frontMatter: parsed.data };
}

// EJSテンプレートにデータを埋め込んでHTMLを生成
function generateHtml(content, title, date) {
    const layoutTemplate = fs.readFileSync('layouts/layout.ejs', 'utf-8');
    return ejs.render(layoutTemplate, {
        title: title, // <title>タグに入れるため
        content: content, // 本文
        date: date // 投稿日時
    });
}

// contentディレクトリ内のすべてのMarkdownファイルを処理
const contentDir = 'content';
const files = fs.readdirSync(contentDir);

files.forEach(file => {
    if (path.extname(file) === '.md') {
        const filePath = path.join(contentDir, file);
        const { content: markdownContent, frontMatter } = convertMarkdownToHtml(filePath);

        // フロントマターからタイトルと日付を取得
        const pageTitle = frontMatter.title || 'Untitled'; // フロントマターにtitleがない場合は'Untitled'
        const postDate = frontMatter.date || 'Unknown Date'; // フロントマターにdateがない場合は'Unknown Date'

        // HTMLファイルを生成
        const htmlContent = generateHtml(markdownContent, pageTitle, postDate);

        // 出力先ディレクトリに保存
        const outputFilePath = path.join('output', `${path.basename(file, '.md')}.html`);
        fs.writeFileSync(outputFilePath, htmlContent);

        console.log(`${pageTitle}.html が生成されました！`);
    }
});
