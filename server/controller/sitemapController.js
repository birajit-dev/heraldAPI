const { request } = require('express');
var express = require('express');
require('../model/database');
const { resolve } = require('path');
const rss = require('rss');
const fs = require('fs');
const path = require('path');
const { all } = require('express/lib/application');
const { assert } = require('console');
const { create, xmlEscape } = require('xmlbuilder2');
//Model
const News = require('../model/allnews');

async function generateNewsSitemap() {
  try {
    const articles = await News.find()
      .sort({ news_id: -1 })
      .limit(100)
      .exec();
    const xml = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('urlset')
      .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      .att('xmlns:news', 'https://www.google.com/schemas/sitemap-news/0.9');

    articles.forEach((article) => {
      const url = xml.ele('url');
      url.ele('loc').txt('https://neherald.com/'+ article.post_category +'/' + article.post_url);
      const news = url.ele('news:news');
      news.ele('news:publication')
        .ele('news:name').txt('Northeast Herald');
      news.ele('news:language').txt('en');
      news.ele('news:publication_date').txt(article.update_date);
      news.ele('news:title').txt(article.post_name);
      news.ele('news:keywords').txt(article.post_keyword);
    });

    const xmlString = xml.end({ prettyPrint: true });

    fs.writeFileSync(path.join(__dirname, '../../public/xml/gnews.xml'), xmlString, 'utf8');

    console.log('News sitemap generated successfully.');
  } catch (error) {
    console.error('Error generating news sitemap:', error);
  }
}

async function generateSiteMap() {
  try {
    const articles = await News.find()
      .sort({ news_id: -1 })
      .limit(500)
      .exec();

    const xml = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('urlset', {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9\nhttp://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
      });

    articles.forEach((article) => {
      const url = xml.ele('url');
      url.ele('loc').txt('https://neherald.com/'+ article.post_category +'/' + article.post_url);
      url.ele('lastmod').txt(new Date(article.update_date).toISOString());
    });

    const xmlString = xml.end({ prettyPrint: true });

    fs.writeFileSync(path.join(__dirname, '../../public/xml/sitemap.xml'), xmlString, 'utf8');

    console.log('News sitemap generated successfully.');
  } catch (error) {
    console.error('Error generating news sitemap:', error);
  }
}

generateSiteMap();
generateNewsSitemap();

// // Run the functions every 1 hour
setInterval(() => {
  generateSiteMap();
  generateNewsSitemap();
}, 60 * 60 * 1000); // 1 hour in milliseconds
