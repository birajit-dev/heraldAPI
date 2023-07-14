const { request } = require('express');
var express = require('express');
require('../model/database');
const allNews = require('../model/allnews');
const pagekeyword = require('../model/pagekeyword');
const allPag = require('../model/allpage');
const breakingNews = require('../model/breakingnews');
const allGallery = require('../model/gallery');
const YouTube = require('../model/youtube');
const { resolve } = require('path');
const { all } = require('express/lib/application');
const { assert } = require('console');
const youtube = require('../model/youtube');
const { create, xmlEscape } = require('xmlbuilder2');
const allnews = require('../model/allnews');

const rss = require('rss');

const fs = require('fs');
const path = require('path');



        exports.homePage = async(req, res, next) => {
            try{
                const topnews = await allNews.find({ne_insight:'yes'}).sort({news_id:-1}).limit('1').lean();
                const latestnews = await allNews.find({post_topic:{$ne:'headlines'},post_category:{$ne:'article'}}).sort({news_id:-1}).limit('3').lean();

                let ftopNews = [];
                for(var i=0 ;i<topnews.length;i++) {
                      ftopNews.push(topnews[i].post_name);   
                }
                const skipOneTopNews = ftopNews.toString();
                const tripuranews = await allNews.find({post_category:'tripura',post_name:{$ne:skipOneTopNews}}).sort({news_id:-1}).limit('10').lean();
                //const relatedNews = await allNews.find({post_category:catD,post_url:{$ne:nUrl}}).sort({news_id:-1}).limit('5').lean();
                //Tripura All News
                // const tripuranews = await allNews.find({post_category:'tripura',ne_insight:{$ne:'yes'}}).sort({news_id:-1}).limit('5').lean();
                const nationalnews = await allNews.find({post_category:'national'}).sort({news_id:-1}).skip('1').limit('5').lean();
                const nationalone = await allNews.find({post_category:'national'}).sort({news_id:-1}).limit('1').lean();

                const sportnews = await allNews.find({post_category:'sports'}).sort({news_id:-1}).skip('1').limit('4').lean();
                const sportone = await allNews.find({post_category:'sports'}).sort({news_id:-1}).limit('1').lean();

                const globalnews = await allNews.find({post_category:'world'}).sort({news_id:-1}).skip('1').limit('6').lean();
                const globalone = await allNews.find({post_category:'world'}).sort({news_id:-1}).limit('1').lean();
                const globaltwo = await allNews.find({post_category:'world'}).sort({news_id:-1}).limit('3').lean(); 

                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

                const entertainment = await allNews.find({post_category:'showbiz'}).sort({news_id:-1}).skip('1').limit('5').lean();
                const entertainmentone = await allNews.find({post_category:'showbiz'}).sort({news_id:-1}).limit('1').lean();

                const finance = await allNews.find({post_category:'finance'}).sort({news_id:-1}).skip('1').limit('5').lean();
                const financeone = await allNews.find({post_category:'finance'}).sort({news_id:-1}).limit('1').lean();

                const article = await allNews.find({post_category:'article'}).sort({news_id:-1}).limit('3').lean();
                const spotlight = await allNews.find({post_category:'health'}).sort({news_id:-1}).limit('6').lean();

                const topheadlines = await allNews.find({ne_insight:'yes'}).sort({news_id:-1}).limit('1').lean();
                //const topheadlines = await allNews.find({news_id:'3291'}).sort({news_id:-1}).limit('1').lean();
                
                const gallery = await allGallery.find().sort({gallery_id:-1}).limit('5').lean();
                const skipGallery = await allGallery.find().sort({gallery_id:-1}).skip(1).limit('10').lean();

                //YouTube Fetch
                //const fYt = await youtube.find().sort({video_id:-1}).limit('1').lean();
                const fYotube = await youtube.find().sort({video_id:-1}).limit('6').lean();

                res.render('home',
                {
                    pageTitle: 'Northeast Herald | Agartala News, Tripura News, Kokborok News, Northeast News',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    tripuranews,
                    topnews,
                    latestnews,
                    nationalnews,
                    sportnews,
                    globalnews,
                    bnews,
                    gallery,
                    skipGallery,
                    topheadlines,
                    spotlight, 
                    entertainment, 
                    finance,
                    article, nationalone, sportone, globalone, globaltwo, entertainmentone, financeone, fYotube
                });
            }
            catch{
                res.status(500).send({message: error.message || "Error in Homepage"});
            }
        }

        exports.newsPage = async(req, res) =>{
            try{
                let nUrl = req.params.id;
                let catD = req.params.cate;
                const singlenews = await allNews.findOne({post_category:catD,post_url:nUrl}).lean();
                const relatedNews = await allNews.find({post_category:catD,post_url:{$ne:nUrl}}).sort({news_id:-1}).limit('5').lean();
                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

                console.log(singlenews.post_name);
                //const rNews = await allNews.find({}).sort({news_id:-1}).limit('3');
                res.render('news',
                {
                    pageTitle: singlenews.post_name + ' | Northeast Herald',
                    pageKeyword: singlenews.post_keyword,
                    pageDescription: singlenews.meta_description,
                    pageUrl: 'https://www.neherald.com/'+singlenews.post_category+'/'+singlenews.post_url,
                    imageCard: singlenews.post_image,
                    singlenews,
                    relatedNews, 
                    bnews
                    
                });
            }
            catch{
                res.redirect('/error/404')
            }
        }

        exports.categoryPage = async(req, res) => {
            try{
            let catName = req.params.cat;
            const categoryAll = await allNews.find({post_category:catName}).sort({news_id:-1}).lean();
            const recentNewscat = await allNews.find({post_category:{$ne:catName}}).sort({news_id:-1}).limit('10').lean();
            const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

            //const pk = await allKey.findOne({page_category:catName});
            res.render('category',
            {
                    pageTitle: catName.charAt(0).toUpperCase() + catName.slice(1) + ' | Northeast Herald',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    pageCategory: catName,
                    categoryAll,
                    recentNewscat,
                    bnews,
                    catName
            });
            }
            catch{
                res.status(500).send({message: error.message || "Error in Category Page"});
            }
        }

        exports.pagesection = async(req, res) => {
            try{
                let pUrl = req.params.pageurl;
                const pageI = await allPag.findOne({page_url:pUrl}).lean();
                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

                //const pk = await allKey.findOne({page_category:catName});
                res.render('pages',
                {
                        pageTitle: pageI.page_title + ' | Northeast Herald',
                        pageKeyword: pageI.page_keyword,
                        pageDescription: pageI.page_description,
                        pageUrl: 'https://www.neherald.com/'+pageI.page_url,
                        imageCard: 'https://www.neherald.com/logo.png',
                        pageI,
                        bnews,
                        heading: pageI.page_title
                });
            }
                catch{
                    res.status(500).send({message: error.message || "Error in Category Page"});
                }
            
        }

        exports.topNewsPage = async(req, res) =>{
            const topheadlines = await allNews.find({ne_insight:'yes'}).sort({news_id:-1}).lean();
            const recentNewscat = await allNews.find().sort({news_id:-1}).limit('10').lean();
            //const oneDay = await allNews.find({news_id:'3291'}).sort({news_id:-1}).limit('1').lean();
            const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();
            res.render('topnews',{
                    pageTitle: 'Tripura Top News : Northeast Herald',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    topheadlines,
                    recentNewscat,
                    topheadlines,
                    bnews,
                    //oneDay

            })
        }

        exports.Error = async(req, res) =>{
            res.render('404');
        }

        exports.searchNews = async(req, res, next) =>{
            try {
                const squery = req.query.q;    
                const searchQuery = await allNews.find({$text: {$search:squery}}).sort({news_id:-1}).lean();
                const recentNewscat = await allNews.find().sort({news_id:-1}).limit('8').lean();

                console.log(searchQuery)
                //res.json(topnews);
                res.render('search',
                {
                    pageTitle: squery.charAt(0).toUpperCase() + squery.slice(1) + ' | Northeast Herald',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    pageCategory: squery,
                    searchQuery, recentNewscat
                });
            } catch(error) {
                next(error);
            }

        }

        exports.photoAlbum = async(req, res, next) =>{
            try{
                const allgallery = await allGallery.find().sort({gallery_id:-1}).lean();
                res.render('album',
                {
                    pageTitle: 'Photo Album| Northeast Herald',
                    pageKeyword: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    pageDescription: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    pageUrl: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png',
                    allgallery
                    
                });
            }
            catch{
                res.redirect('/error/404')
            }   
        }




        exports.homeAPI = async(req, res, next) => {
            try{
                const topnews = await allNews.find({ne_insight:'yes'}).sort({news_id:-1}).limit('1').lean();
                const latestnews = await allNews.find({post_topic:{$ne:'headlines'},post_category:{$ne:'article'}}).sort({news_id:-1}).limit('3').lean();

                let ftopNews = [];
                for(var i=0 ;i<topnews.length;i++) {
                      ftopNews.push(topnews[i].post_name);   
                }

                const skipOneTopNews = ftopNews.toString();


                const tripuranews = await allNews.find({post_category:'tripura',post_name:{$ne:skipOneTopNews}}).sort({news_id:-1}).limit('10').lean();
                //const relatedNews = await allNews.find({post_category:catD,post_url:{$ne:nUrl}}).sort({news_id:-1}).limit('5').lean();

                //Tripura All News
                // const tripuranews = await allNews.find({post_category:'tripura',ne_insight:{$ne:'yes'}}).sort({news_id:-1}).limit('5').lean();

                const nationalnews = await allNews.find({post_category:'national'}).sort({news_id:-1}).skip('1').limit('5').lean();
                const nationalone = await allNews.find({post_category:'national'}).sort({news_id:-1}).limit('1').lean();

                const sportnews = await allNews.find({post_category:'sports'}).sort({news_id:-1}).skip('1').limit('4').lean();
                const sportone = await allNews.find({post_category:'sports'}).sort({news_id:-1}).limit('1').lean();

                const globalnews = await allNews.find({post_category:'world'}).sort({news_id:-1}).skip('1').limit('6').lean();
                const globalone = await allNews.find({post_category:'world'}).sort({news_id:-1}).limit('1').lean();
                const globaltwo = await allNews.find({post_category:'world'}).sort({news_id:-1}).limit('3').lean(); 

                const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

                const entertainment = await allNews.find({post_category:'showbiz'}).sort({news_id:-1}).skip('1').limit('5').lean();
                const entertainmentone = await allNews.find({post_category:'showbiz'}).sort({news_id:-1}).limit('1').lean();

                const finance = await allNews.find({post_category:'finance'}).sort({news_id:-1}).skip('1').limit('5').lean();
                const financeone = await allNews.find({post_category:'finance'}).sort({news_id:-1}).limit('1').lean();

                const article = await allNews.find({post_category:'article'}).sort({news_id:-1}).limit('2').lean();
                const spotlight = await allNews.find({post_category:'health'}).sort({news_id:-1}).limit('3').lean();

                const topheadlines = await allNews.find({ne_insight:'yes'}).sort({news_id:-1}).limit('1').lean();
                //const topheadlines = await allNews.find({news_id:'3291'}).sort({news_id:-1}).limit('1').lean();
                
                const gallery = await allGallery.find().sort({gallery_id:-1}).limit('5').lean();
                const skipGallery = await allGallery.find().sort({gallery_id:-1}).skip(1).limit('10').lean();

                //YouTube Fetch
                const fYt = await youtube.find().sort({video_id:-1}).limit('1').lean();
                const fYotube = await youtube.find().sort({video_id:-1}).skip(1).limit('4').lean();

                res.json(
                    tripuranews,
                    topnews,
                    latestnews,
                    nationalnews,
                    sportnews,
                    globalnews,
                    bnews,
                    gallery,
                    skipGallery,
                    topheadlines,
                    spotlight, 
                    entertainment, 
                    finance,
                    article, nationalone, sportone, globalone, globaltwo, entertainmentone, financeone, fYotube,fYt
                );
            }
            catch{
                res.status(500).send({message: error.message || "Error in Homepage"});
            }
        }



        async function generateNewsSitemap() {
            try {
            const articles = await allNews.find()
                .sort({ publishedAt: -1 })
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
        
            fs.writeFileSync(path.join(__dirname, '../../public/gnews.xml'), xmlString, 'utf8');
        
            console.log('News sitemap generated successfully.');
            } catch (error) {
            console.error('Error generating news sitemap:', error);
            }
        }
        
        generateNewsSitemap();

          exports.SiteMap = async (req, res) => {
            try {
              const sitemapXml = await generateNewsSitemap();
              res.header('Content-Type', 'application/xml');
              res.send(sitemapXml);
            } catch (error) {
              console.error(error);
              res.status(500).send('Internal Server Error');
            }
        };
          



        async function generateSiteMap() {
        try {
            const articles = await allNews.find()
            .sort({ publishedAt: -1 })
            .limit(100)
            .exec();

            const xml = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('urlset', {
                xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9\nhttp://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
            });

            articles.forEach((article) => {
            xml.ele('url')
                .ele('loc').txt('https://neherald.com/'+ article.post_category +'/' + article.post_url).up()
                .ele('lastmod').txt(new Date(article.update_date).toISOString())
                .ele('priority').txt('1.00').up()
                .up();
            });

            const xmlString = xml.end({ prettyPrint: true });

            fs.writeFileSync(path.join(__dirname, '../../public/sitemap.xml'), xmlString, 'utf8');

            console.log('News sitemap generated successfully.');
        } catch (error) {
            console.error('Error generating news sitemap:', error);
        }
        }

        generateSiteMap();



        exports.TripuraXML = async (req, res) => {
            try {
              const articles = await allNews.find().limit(20).exec();
              // Create a new RSS feed
              const feed = new rss({
                title: 'Tripura | Northeast Herald',
                description: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                feed_url: 'https://neherald.com/tripura',
                site_url: 'https://neherald.com/tripura',
                image_url: 'https://neherald.com/images/favicon/apple-icon-57x57.png',
                managingEditor: 'editor@example.com',
                language: 'en',
                pubDate: new Date(),
              });
          
              // Add each article to the feed
              articles.forEach(article => {
                feed.item({
                  title: article.post_name,
                  description: `<div><img src="${article.post_image}" style="width: 100%;" /><div>${article.post_name}</div></div>`,
                  url: article.post_url,
                  guid: article._id.toString(),
                  author: 'editor@example.com',
                  date: article.update_date,
                });
                      // Add media:content field
              });
          
              // Set the response content type to XML
              res.set('Content-Type', 'application/rss+xml');
          
              // Send the generated RSS feed as the response
              fs.writeFileSync(path.join(__dirname, '../../public/national.xml'), feed.xml(), 'utf8');

              //res.send(feed.xml());
            } catch (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
            }
          }