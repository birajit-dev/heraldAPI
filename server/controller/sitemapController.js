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
    // Get articles from the last 2 days only (Google News requirement)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const articles = await News.find({
      post_category: { $ne: 'article' }, // Exclude articles, only news
      post_name: { $exists: true, $ne: '' },
      post_url: { $exists: true, $ne: '' }
    })
      .sort({ news_id: -1 })
      .limit(100)
      .exec();
    
    const xml = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('urlset')
      .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      .att('xmlns:news', 'https://www.google.com/schemas/sitemap-news/0.9');

    // Use a Set to track unique URLs and avoid duplicates
    const processedUrls = new Set();

    articles.forEach((article) => {
      const articleUrl = 'https://neherald.com/'+ article.post_category +'/' + article.post_url;
      
      // Skip if we've already processed this URL
      if (processedUrls.has(articleUrl)) {
        return;
      }
      processedUrls.add(articleUrl);

      const url = xml.ele('url');
      url.ele('loc').txt(articleUrl);
      const news = url.ele('news:news');
      const publication = news.ele('news:publication');
      publication.ele('news:name').txt('Northeast Herald');
      publication.ele('news:language').txt('en');
      
      // Convert date to proper ISO 8601 format
      let publicationDate;
      try {
        // Try to parse the existing date format
        if (article.update_date) {
          const dateObj = new Date(article.update_date);
          if (!isNaN(dateObj.getTime())) {
            publicationDate = dateObj.toISOString();
          } else {
            // Fallback to current date if parsing fails
            publicationDate = new Date().toISOString();
          }
        } else {
          publicationDate = new Date().toISOString();
        }
      } catch (error) {
        console.error('Date parsing error for article:', article.post_name, error);
        publicationDate = new Date().toISOString();
      }
      
      news.ele('news:publication_date').txt(publicationDate);
      news.ele('news:title').txt(article.post_name);
      
      // Ensure keywords are properly formatted
      const keywords = article.post_keyword || 'agartala news, tripura news, northeast herald';
      news.ele('news:keywords').txt(keywords);
    });

    const xmlString = xml.end({ prettyPrint: true });

    fs.writeFileSync(path.join(__dirname, '../../public/xml/gnews.xml'), xmlString, 'utf8');

    console.log('News sitemap generated successfully with', processedUrls.size, 'unique articles.');
  } catch (error) {
    console.error('Error generating news sitemap:', error);
  }
}

async function generateSiteMap() {
  try {
    const articles = await News.find({
      post_name: { $exists: true, $ne: '' },
      post_url: { $exists: true, $ne: '' }
    })
      .sort({ news_id: -1 })
      .limit(1000)
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
