const { request } = require('express');
var express = require('express');
require('../model/database');
const allNews = require('../model/allnews');
const allPages = require('../model/allpage');
const adminData =  require('../model/login');
const breakingNews = require('../model/breakingnews');
const Ibns = require('../model/ibns');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { resolve } = require('path');
//const { rejects } = require('assert');
const { all } = require('express/lib/application');
const { assert } = require('console');
const fetch = require('node-fetch');
const _ = require('lodash');
const allnews = require('../model/allnews');
const { title } = require('process');
const breakingnews = require('../model/breakingnews');
var moment = require('moment'); // require
const axios = require('axios');



    //Random Function
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    const ranDom = getRandomInt(9999);

/*
    const event = new Date();
    const options = {  year: 'numeric', month: 'short', day: 'numeric' };
    const newDate = event.toString('en-US', options);


    exports.sports = async(req, res) =>{
        const newDate = moment().format('lll');
        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            var sports = json.news.sports;
                if(sports !=null){  
                    for(var i=0;i<sports.length;i++){     
                        if(sports[i].content.length>10){  
                            var selected=dashAllNews.filter(it =>
                            it.ibns_id === sports[i].id 
                            );        
                            if(selected != null && selected.length>0){
                            }
                            else{
                                var iurl = sports[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                let ipage = new allNews({
                                post_name: sports[i].title,
                                post_url: iurl,
                                post_summary: sports[i].description,
                                post_content:sports[i].content,
                                post_keyword:'agartala news, tripura news, northeast herald, sports news',
                                meta_description:sports[i].description,
                                post_category:'sports',
                                post_image:sports[i].imageName,
                                meta_tags:'Sport news, ',
                                post_topic:'',
                                post_editor:'No',
                                ne_insight:'No',
                                author:'IBNS',
                                update_date:newDate,
                                ibns_id:sports[i].id
                                });
                                ipage.save();      
                            }        
                        }
                    }
                } 
            })
        }

    exports.news = async(req, res) =>{
        const newDate = moment().format('lll');

        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
        var news = json.news.news;		
        if(news !=null){  
            for(var i=0;i<news.length;i++){     
                if(news[i].content.length>10){  
                    var selected=dashAllNews.filter(it =>
                    it.ibns_id === news[i].id 
                    );        
                    if(selected != null && selected.length>0){
                    }
                    else{
                        var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        let ipage = new allNews({
                        post_name: news[i].title,
                        post_url: iurl,
                        post_summary: news[i].description,
                        post_content:news[i].content,
                        post_keyword:'agartala news, tripura news, northeast herald, news news',
                        meta_description:news[i].description,
                        post_category:'national',
                        post_image:news[i].imageName,
                        meta_tags:'Sport news, ',
                        post_topic:'',
                        post_editor:'No',
                        ne_insight:'No',
                        author:'IBNS',
                        update_date:newDate,
                        ibns_id:news[i].id
                        });
                        ipage.save();      
                    }        
                }
            }
        }
        })
    }

    exports.finance = async(req, res) =>{
        const newDate = moment().format('lll');

        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
        var news = json.news.finance;		
        if(news !=null){  
            for(var i=0;i<news.length;i++){     
                if(news[i].content.length>10){  
                    var selected=dashAllNews.filter(it =>
                    it.ibns_id === news[i].id 
                    );        
                    if(selected != null && selected.length>0){
                    }
                    else{
                        var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        let ipage = new allNews({
                        post_name: news[i].title,
                        post_url: iurl,
                        post_summary: news[i].description,
                        post_content:news[i].content,
                        post_keyword:'agartala news, tripura news, northeast herald, news news',
                        meta_description:news[i].description,
                        post_category:'finance',
                        post_image:news[i].imageName,
                        meta_tags:'Sport news, ',
                        post_topic:'',
                        post_editor:'No',
                        ne_insight:'No',
                        author:'IBNS',
                        update_date:newDate,
                        ibns_id:news[i].id
                        });
                        ipage.save();      
                    }        
                }
            }
        }
        })

    }

    exports.showbiz = async(req, res) =>{
        const newDate = moment().format('lll');

        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
        var news = json.news.showbiz;		
        if(news !=null){  
            for(var i=0;i<news.length;i++){     
                if(news[i].content.length>10){  
                    var selected=dashAllNews.filter(it =>
                    it.ibns_id === news[i].id 
                    );        
                    if(selected != null && selected.length>0){
                    }
                    else{
                        var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        let ipage = new allNews({
                        post_name: news[i].title,
                        post_url: iurl,
                        post_summary: news[i].description,
                        post_content:news[i].content,
                        post_keyword:'agartala news, tripura news, northeast herald, news news',
                        meta_description:news[i].description,
                        post_category:'showbiz',
                        post_image:news[i].imageName,
                        meta_tags:'Sport news, ',
                        post_topic:'',
                        post_editor:'No',
                        ne_insight:'No',
                        author:'IBNS',
                        update_date:newDate,
                        ibns_id:news[i].id
                        });
                        ipage.save();      
                    }        
                }
            }
        }
        })

    }

    exports.life = async(req, res) =>{
        const newDate = moment().format('lll');

        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
        var news = json.news.life;		
        if(news !=null){  
            for(var i=0;i<news.length;i++){     
                if(news[i].content.length>10){  
                    var selected=dashAllNews.filter(it =>
                    it.ibns_id === news[i].id 
                    );        
                    if(selected != null && selected.length>0){
                    }
                    else{
                        var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        let ipage = new allNews({
                        post_name: news[i].title,
                        post_url: iurl,
                        post_summary: news[i].description,
                        post_content:news[i].content,
                        post_keyword:'agartala news, tripura news, northeast herald, news news',
                        meta_description:news[i].description,
                        post_category:'life',
                        post_image:news[i].imageName,
                        meta_tags:'Sport news, ',
                        post_topic:'',
                        post_editor:'No',
                        ne_insight:'No',
                        author:'IBNS',
                        update_date:newDate,
                        ibns_id:news[i].id
                        });
                        ipage.save();      
                    }        
                }
            }
        }
        })

    }

    exports.world = async(req, res) =>{
        const newDate = moment().format('lll');

        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
        var news = json.news.world;		
        if(news !=null){  
            for(var i=0;i<news.length;i++){     
                if(news[i].content.length>10){  
                    var selected=dashAllNews.filter(it =>
                    it.ibns_id === news[i].id 
                    );        
                    if(selected != null && selected.length>0){
                    }
                    else{
                        var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        let ipage = new allNews({
                        post_name: news[i].title,
                        post_url: iurl,
                        post_summary: news[i].description,
                        post_content:news[i].content,
                        post_keyword:'agartala news, tripura news, northeast herald, news news',
                        meta_description:news[i].description,
                        post_category:'world',
                        post_image:news[i].imageName,
                        meta_tags:'Sport news, ',
                        post_topic:'',
                        post_editor:'No',
                        ne_insight:'No',
                        author:'IBNS',
                        update_date:newDate,
                        ibns_id:news[i].id
                        });
                        ipage.save();      
                    }        
                }
            }
        }
        })

    }

    exports.health = async(req, res) =>{
        const newDate = moment().format('lll');

        let url = "https://www.indiablooms.com/news/feeds.json";
        const dashAllNews = await allNews.find().sort({ibns_id:-1}).lean();
        let settings = { method: "Get" };
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
        var news = json.news.health;		
        if(news !=null){  
            for(var i=0;i<news.length;i++){     
                if(news[i].content.length>10){  
                    var selected=dashAllNews.filter(it =>
                    it.ibns_id === news[i].id 
                    );        
                    if(selected != null && selected.length>0){
                    }
                    else{
                        var iurl = news[i].title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        let ipage = new allNews({
                        post_name: news[i].title,
                        post_url: iurl,
                        post_summary: news[i].description,
                        post_content:news[i].content,
                        post_keyword:'agartala news, tripura news, northeast herald, news news',
                        meta_description:news[i].description,
                        post_category:'health',
                        post_image:news[i].imageName,
                        meta_tags:'Sport news, ',
                        post_topic:'',
                        post_editor:'No',
                        ne_insight:'No',
                        author:'IBNS',
                        update_date:newDate,
                        ibns_id:news[i].id
                        });
                        ipage.save();      
                    }        
                }
            }
        }
        })

    }



exports.saveAllIbns = async (req, res) => {
    const categories = ['sports', 'news', 'finance', 'showbiz', 'life', 'world', 'health'];
    const newDate = moment().format('lll');
    const url = 'https://www.indiablooms.com/news/feeds.json';
    const dashAllNews = await allNews.find().sort({ ibns_id: -1 }).lean();
    const settings = { method: 'GET' };
  
    try {
      const response = await fetch(url, settings);
      const json = await response.json();
  
      for (const category of categories) {
        const data = json.news[category];
  
        if (data != null) {
          for (const item of data) {
            if (item.content.length > 10) {
              const selected = dashAllNews.find((it) => it.ibns_id === item.id);
  
              if (!selected) {
                const iurl = item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                const postCategory = category === 'news' ? 'national' : category;
                const ipage = new allNews({
                  post_name: item.title,
                  post_url: iurl,
                  post_summary: item.description,
                  post_content: item.content,
                  post_keyword: `agartala news, tripura news, northeast herald, ${postCategory} news`,
                  meta_description: item.description,
                  post_category: postCategory,
                  post_image: item.imageName,
                  meta_tags: 'Sport news',
                  post_topic: '',
                  post_editor: 'No',
                  ne_insight: 'No',
                  author: 'IBNS',
                  update_date: newDate,
                  ibns_id: item.id
                });
                await ipage.save();
              }
            }
          }
        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.error('Error in fetching and saving data:', error);
      res.sendStatus(500);
    }
  };
      
*/
/*
exports.saveAllIbns = async (req, res) => {
  const categories = ['sports', 'news', 'finance', 'showbiz', 'life', 'world', 'health'];
  const newDate = moment().format('lll');
  const url = 'https://www.indiablooms.com/feeds/json/news';
  const dashAllNews = await allNews.find().sort({ ibns_id: -1 }).lean();
  const settings = { method: 'GET' };

  try {
    const response = await fetch(url, settings);
    const json = await response.json();

    for (const category of categories) {
      const data = json.news[category];

      if (data != null) {
        for (const item of data) {
          if (item.content.length > 10) {
            const selected = dashAllNews.find((it) => it.post_name === item.title);

            if (!selected) {
              const iurl = item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
              const postCategory = category === 'news' ? 'national' : category;
              const ipage = new allNews({
                post_name: item.title,
                post_url: iurl,
                post_summary: item.description,
                post_content: item.content,
                post_keyword: `agartala news, tripura news, northeast herald, ${postCategory} news`,
                meta_description: item.description,
                post_category: postCategory,
                post_image: item.imageName,
                meta_tags: 'Sport news',
                post_topic: '',
                post_editor: 'No',
                ne_insight: 'No',
                author: 'IBNS',
                update_date: newDate,
                ibns_id: item.id
              });
              await ipage.save();
            }
          }
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in fetching and saving data:', error);
    res.sendStatus(500);
  }
};
*/
exports.saveAllIbns = async (req, res) => {
  try {
    const categories = ['sports', 'news', 'finance', 'showbiz', 'life', 'world', 'health'];
    const newDate = moment().format('lll');
    const url = 'https://www.indiablooms.com/feeds/json/news';
    
    // Get existing articles with both ibns_id and post_name for better duplicate checking
    const dashAllNews = await allNews.find({}, { ibns_id: 1, post_name: 1, post_url: 1 }).sort({ ibns_id: -1 }).lean();
    const settings = { method: 'GET' };

    let savedArticles = [];

    const response = await fetch(url, settings);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();

    for (const category of categories) {
      const data = json.news[category];

      if (!data || !Array.isArray(data)) continue;

      for (const item of data) {
        if (!item?.content || item.content.length <= 10 || !item?.title || !item?.id) continue;

        // Check for duplicates using multiple criteria
        const existsByIbnsId = dashAllNews.find(it => it.ibns_id === item.id);
        const existsByTitle = dashAllNews.find(it => it.post_name === item.title);
        
        // Generate URL to check for URL duplicates
        const iurl = item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const existsByUrl = dashAllNews.find(it => it.post_url === iurl);

        // Skip if any duplicate found
        if (existsByIbnsId || existsByTitle || existsByUrl) {
          console.log(`Skipping duplicate article: ${item.title} (ID: ${item.id})`);
          continue;
        }

        const postCategory = category === 'news' ? 'national' : category;

        const ipage = new allNews({
          post_name: item.title,
          post_url: iurl,
          post_summary: item.description || '',
          post_content: item.content,
          post_keyword: `agartala news, tripura news, northeast herald, ${postCategory} news`,
          meta_description: item.description || '',
          post_category: postCategory,
          post_image: item.imageName || '',
          meta_tags: 'Sport news',
          post_topic: '',
          post_editor: 'No',
          ne_insight: 'No',
          author: 'IBNS',
          update_date: newDate,
          ibns_id: item.id
        });

        try {
          const savedArticle = await ipage.save();
          if (!savedArticle) continue;

          // Add to our local tracking to prevent duplicates within this batch
          dashAllNews.push({
            _id: savedArticle._id,
            ibns_id: item.id,
            post_name: item.title,
            post_url: iurl
          });

          savedArticles.push(savedArticle);

          const notification = {
            title: `✨${item.title}`,
            message: `📰 Click here to read more about ${item.title}`,
            url: `https://neherald.com/${postCategory}/${iurl}`
          };

          try {
            await axios.post('https://neherald.com/send', notification);
            console.log('Notification sent successfully for:', item.title);
          } catch (notifError) {
            console.error('Failed to send notification for:', item.title, notifError);
          }
        } catch (saveError) {
          console.error('Error saving article:', saveError);
          // Check if it's a duplicate key error
          if (saveError.code === 11000) {
            console.log(`Duplicate key error for: ${item.title}`);
          }
          continue;
        }
      }
    }

    return res.status(200).json({
      status: 'success',
      message: savedArticles.length > 0 
        ? `Successfully processed ${savedArticles.length} new articles`
        : 'No new articles to process at this time'
    });

  } catch (error) {
    console.error('Error in IBNS feed processing:', error);

    // Cleanup on critical error
    for (const article of savedArticles || []) {
      try {
        await allNews.findByIdAndDelete(article._id);
      } catch (deleteError) {
        console.error('Error deleting article after failure:', deleteError);
      }
    }

    return res.status(500).json({
      status: 'error', 
      message: 'Unable to process IBNS feed at this time'
    });
  }
};
