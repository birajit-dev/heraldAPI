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
                const tripuranews = await allNews.find({post_category:'tripura',post_name:{$ne:skipOneTopNews}}).sort({news_id:-1}).limit('20').lean();


                const northeastNews = await allNews.find({post_category:'northeast',post_name:{$ne:skipOneTopNews}}).sort({news_id:-1}).limit('8').lean();

                
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
                
                const gallery = await allGallery.find({gallery_keyword: { $ne: 'Puja' }}).sort({gallery_id:-1}).limit('5').lean();
                const pujaGallery = await allGallery.find({gallery_keyword:'Puja'}).sort({gallery_id:-1}).lean();
                const skipGallery = await allGallery.find({gallery_keyword: { $ne: 'Puja' }}).sort({gallery_id:-1}).skip(1).limit('10').lean();

                //YouTube Fetch
                //const fYt = await youtube.find().sort({video_id:-1}).limit('1').lean();
                const fYotube = await youtube.find().sort({video_id:-1}).limit('6').lean();

                res.render('home',
                {
                    pageTitle: 'Northeast Herald - Tripura\'s Leading News Portal | Agartala Breaking News, Politics & Updates',
                    pageKeyword: 'tripura news, agartala news, northeast herald, tripura breaking news, tripura politics, tripura government, agartala city news, tripura latest news, northeast india news, kokborok news, tripura assembly, tripura cm news, tripura sports news, tripura business news',
                    pageDescription: 'Northeast Herald is Tripura\'s most trusted news source covering Agartala, state politics, government updates, sports, business and breaking news. Stay informed with authentic journalism from the heart of Northeast India.',
                    pageUrl: 'https://neherald.com/',
                    imageCard: 'https://neherald.com/images/logo.png',
                    tripuranews,
                    topnews,
                    latestnews,
                    nationalnews,
                    sportnews,
                    globalnews,
                    bnews,
                    gallery,
                    skipGallery,
                    pujaGallery,
                    topheadlines,
                    spotlight, 
                    entertainment, 
                    finance,
                    article, nationalone, sportone, globalone, globaltwo, entertainmentone, financeone, fYotube, northeastNews
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
                // Convert date to ISO format for better SEO
                let publishedDate;
                try {
                    publishedDate = new Date(singlenews.update_date).toISOString();
                } catch (error) {
                    publishedDate = new Date().toISOString();
                }

                res.render('news',
                {
                    pageTitle: singlenews.post_name + ' | Northeast Herald',
                    pageKeyword: singlenews.post_keyword,
                    pageDescription: singlenews.meta_description,
                    pageUrl: 'https://www.neherald.com/'+singlenews.post_category+'/'+singlenews.post_url,
                    imageCard: singlenews.post_image,
                    publishedDate: publishedDate,
                    articleAuthor: singlenews.author || 'Northeast Herald',
                    articleSection: singlenews.post_category,
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
            let page = parseInt(req.query.page) || 1;
            const limit = 20;
            const skip = (page - 1) * limit;
            
            const totalNews = await allNews.countDocuments({post_category:catName});
            const totalPages = Math.ceil(totalNews / limit);
            
            const categoryAll = await allNews.find({post_category:catName}).sort({news_id:-1}).skip(skip).limit(limit).lean();
            const recentNewscat = await allNews.find({post_category:{$ne:catName}}).sort({news_id:-1}).limit('10').lean();
            const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();

            // Create pagination range for handlebars template
            const paginationRange = [];
            const startPage = Math.max(1, page - 2);
            const endPage = Math.min(totalPages, page + 2);
            
            for (let i = startPage; i <= endPage; i++) {
                paginationRange.push({
                    page: i,
                    isCurrent: i === page
                });
            }

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
                    catName,
                    currentPage: page,
                    totalPages: totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    paginationRange: paginationRange
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
            try {
                // Get latest news for 404 page
                const latestNews = await allNews.find({
                    post_category: { $ne: 'article' }
                }).sort({news_id: -1}).limit(5).lean();
                
                res.status(404).render('404', {
                    pageTitle: 'Page Not Found - Northeast Herald',
                    pageDescription: 'The page you are looking for could not be found. Browse our latest news and articles.',
                    pageKeyword: 'northeast herald, tripura news, page not found, latest news',
                    latestNews
                });
            } catch (error) {
                console.error('Error in 404 page:', error);
                res.status(404).render('404', {
                    pageTitle: 'Page Not Found - Northeast Herald',
                    pageDescription: 'The page you are looking for could not be found.',
                    pageKeyword: 'northeast herald, tripura news, page not found'
                });
            }
        }

        // Load More API for Infinite Scroll
        exports.loadMoreNews = async(req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;
                const category = req.query.category || 'all';
                
                let query = { post_category: { $ne: 'article' } };
                if (category !== 'all') {
                    query.post_category = category;
                }
                
                const articles = await allNews.find(query)
                    .sort({ news_id: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean();
                    
                res.json({ articles, hasMore: articles.length === limit });
            } catch (error) {
                res.status(500).json({ error: 'Failed to load more news' });
            }
        };

        // Trending News API
        exports.getTrendingNews = async(req, res) => {
            try {
                const trending = await allNews.find({
                    post_category: { $ne: 'article' },
                    ne_insight: 'yes'
                }).sort({ news_id: -1 }).limit(5).lean();
                
                res.json(trending);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch trending news' });
            }
        };

        // Related News API
        exports.getRelatedNews = async(req, res) => {
            try {
                const { category, id } = req.params;
                const related = await allNews.find({
                    post_category: category,
                    post_url: { $ne: id }
                }).sort({ news_id: -1 }).limit(5).lean();
                
                res.json(related);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch related news' });
            }
        };

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



exports.pushPage = async(req, res) =>{
            res.render('push');
        }

