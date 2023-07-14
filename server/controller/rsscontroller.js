const express = require('express');
const rss = require('rss');
const fs = require('fs');
const path = require('path');
const allNews = require('../model/allnews');

exports.generateRSS = async (req, res) => {
  try {
    const categories = ['tripura', 'sports', 'national', 'finance', 'showbiz', 'life', 'world', 'health'];

    for (const category of categories) {
      const articles = await allNews.find({ post_category: category }).sort({news_id: -1}).limit(20).exec();

      // Create a new RSS feed
      const feed = new rss({
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} | Northeast Herald`,
        description:
          'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
        feed_url: `https://neherald.com/${category}`,
        site_url: `https://neherald.com/${category}`,
        image_url: 'https://neherald.com/images/favicon/apple-icon-57x57.png',
        managingEditor: 'editor@neherald.com',
        language: 'en',
        pubDate: new Date(),
      });

      articles.forEach((article) => {
        feed.item({
          title: article.post_name,
          description: `<div><img src="${article.post_image}" style="width: 100%;" /><div>${article.post_name}</div></div>`,
          url: `https://neherald.com/${article.post_category}/${article.post_url}`,
          guid: article._id.toString(),
          author: 'Northeast Herald',
          date: article.update_date,
        });
      });

      // Set the response content type to XML
      res.set('Content-Type', 'application/rss+xml');

      // Save the RSS feed to a file
      const rssFilePath = path.join(__dirname, `../../public/rss/${category}.xml`);
      fs.writeFileSync(rssFilePath, feed.xml(), 'utf8');

      console.log(`Generated RSS feed for category: ${category}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
