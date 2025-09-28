const express = require('express');
require('../model/database');
const allNews = require('../model/allnews');
const breakingNews = require('../model/breakingnews');
const allGallery = require('../model/gallery');
const youtube = require('../model/youtube');
const PageViewModel = require('../model/pageview');

exports.TripuraHomePage = async(req, res, next) => {
    try{
        // Use aggregation pipeline for better performance
        const result = await allNews.aggregate([
            {
                $match: { post_category: 'tripura' }
            },
            {
                $sort: { news_id: -1 }
            },
            {
                $project: {
                    post_content: 0 // Exclude post_content
                }
            },
            {
                $facet: {
                    topnews: [
                        { $match: { ne_insight: 'yes' } },
                        { $limit: 1 }
                    ],
                    allnews: [
                        { $limit: 11 } // Get 11 to account for potential top news
                    ]
                }
            }
        ]);

        const topnews = result[0].topnews;
        let tripuranews = result[0].allnews;

        // If there's a top news, filter it out from tripuranews
        if (topnews.length > 0) {
            const topNewsId = topnews[0]._id;
            tripuranews = tripuranews.filter(news => !news._id.equals(topNewsId)).slice(0, 10);
        } else {
            tripuranews = tripuranews.slice(0, 10);
        }

        res.json({
            success: true,
            data: {
                tripuranews
            }
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error in Tripura API"
        });
    }
}


exports.NationalHomePage = async(req, res, next) => {
    try{
        const nationalnews = await allNews.find({post_category:'national'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        res.json({
            success: true,
            data: {
                nationalnews
            }
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error in National API"
        });
    }
}

exports.InternationalHomePage = async(req, res, next) => {
    try{
        const internationalnews = await allNews.find({post_category:'world'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        res.json({
            success: true,
            data: {
                internationalnews
            }
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error in International API"
        });
    }
}

exports.SportsHomePage = async(req, res, next) => {
    try{
        const sportsnews = await allNews.find({post_category:'sports'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        res.json({
            success: true,
            data: {
                sportsnews
            }
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error in Sports API"
        });
    }
}


exports.FinanceHomePage = async(req, res, next) => {
    try{
        const financenews = await allNews.find({post_category:'finance'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        res.json({
            success: true,
            data: {
                financenews
            }
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error in Finance API"
        });
    }
}


exports.ShowbizHomePage = async(req, res, next) => {
    try{
        const showbiznews = await allNews.find({post_category:'showbiz'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        
        // Check if data exists
        if (!showbiznews || showbiznews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No showbiz news found"
            });
        }
        
        res.json({
            success: true,
            data: {
                showbiznews
            }
        });
    }
    catch(error){
        console.error('ShowbizHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Showbiz API"
        });
    }
}

exports.NortheastHomePage = async(req, res, next) => {
    try{
        const northeastnews = await allNews.find({post_category:'northeast'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        
        // Check if data exists
        if (!northeastnews || northeastnews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No northeast news found"
            });
        }
        
        res.json({
            success: true,
            data: {
                northeastnews
            }
        });
    }
    catch(error){
        console.error('NortheastHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Northeast API"
        });
    }
}

exports.HealthHomePage = async(req, res, next) => {
    try{
        const healthnews = await allNews.find({post_category:'health'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        
        // Check if data exists
        if (!healthnews || healthnews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No health news found"
            });
        }
        
        res.json({
            success: true,
            data: {
                healthnews
            }
        });
    }
    catch(error){
        console.error('HealthHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Health API"
        });
    }
}



exports.ArticleHomePage = async(req, res, next) => {
    try{
        const articlenews = await allNews.find({post_category:'article'}).select('-post_content').sort({news_id:-1}).limit('10').lean();
        
        // Check if data exists
        if (!articlenews || articlenews.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No article news found"
            });
        }
        
        res.json({
            success: true,
            data: {
                articlenews
            }
        });
    }
    catch(error){
        console.error('ArticleHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Article API"
        });
    }
}


exports.YoutubeHomePage = async(req, res, next) => {
    try{
        const youtubevideo = await youtube.find().sort({video_id:-1}).limit('6').lean();
        
        // Check if data exists
        if (!youtubevideo || youtubevideo.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No YouTube videos found"
            });
        }
        
        res.json({
            success: true,
            data: {
                youtubevideo
            }
        });
    }
    catch(error){
        console.error('YoutubeHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in YouTube API"
        });
    }
}



exports.GalleryHomePage = async(req, res, next) => {
    try{
        const gallery = await allGallery.find({gallery_keyword: { $ne: 'Puja' }}).sort({gallery_id:-1}).limit(5).lean();

        res.json({
            success: true,
            data: {
                gallery
            }
        });
    }
    catch(error){
        console.error('HomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Homepage"
        });
    }
}

exports.DurgaPujaHomePage = async(req, res, next) => {
    try{
        const gallery = await allGallery.find({
            gallery_keyword: "Durga Puja 2025",
            gallery_keyword: { $not: /other/i }
        }).sort({gallery_id:-1}).limit(5).lean();

        res.json({
            success: true,
            data: {
                gallery
            }
        });
    }
    catch(error){
        console.error('DurgaPujaHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Durga Puja Homepage"
        });
    }
}


exports.TopNewsPage = async(req, res, next) => {
    try{
        const topnews = await allNews.find({ne_insight:'yes'}).select('-post_content').sort({news_id:-1}).limit('1').lean();
        const latestnews = await allNews.find({post_topic:{$ne:'headlines'},post_category:{$ne:'article'}}).select('-post_content').sort({news_id:-1}).limit('4').lean();

        res.json({
            success: true,
            data: {
                topnews,
                latestnews
            }
        });
    }
    catch(error){
        console.error('HomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Homepage"
        });
    }
}

exports.CategoryNewsPage = async(req, res, next) => {
    try{
        const category = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        // Validate category parameter
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category parameter is required"
            });
        }

        // Get total count for pagination
        const totalNews = await allNews.countDocuments({post_category: category});
        const totalPages = Math.ceil(totalNews / limit);

        // Get news for the specified category with pagination
        const categoryNews = await allNews.find({post_category: category})
            .select('-post_content -post_keyword')
            .sort({news_id: -1})
            .skip(skip)
            .limit(limit)
            .lean();

        // Check if data exists
        if (!categoryNews || categoryNews.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No news found for category: ${category}`
            });
        }

        res.json({
            success: true,
            data: {
                categoryNews,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalNews: totalNews,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                    limit: limit
                }
            }
        });
    }
    catch(error){
        console.error('CategoryNewsPage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Category News API"
        });
    }
}

exports.SingleNewsPage = async(req, res) => {
    try {
        const category = req.query.c;
        const slug = req.query.s;
        
        // Validate required parameters
        if (!category || !slug) {
            return res.status(400).json({
                success: false,
                message: "Category and slug query parameters are required"
            });
        }

        // Get the single news article
        const singleNews = await allNews.findOne({
            post_category: category,
            post_url: slug
        }).lean();

        // Check if news exists
        if (!singleNews) {
            return res.status(404).json({
                success: false,
                message: `News article not found for category: ${category} and slug: ${slug}`
            });
        }

        // Get related news from the same category (excluding current article)
        const relatedNews = await allNews.find({
            post_category: category,
            post_url: { $ne: slug }
        }, { post_content: 0 })
        .sort({ news_id: -1 })
        .limit(8)
        .lean();

        // Get latest news from all categories (excluding current article)
        const latestNews = await allNews.find({
            post_url: { $ne: slug },
            post_category: { $ne: 'article' }
        }, { post_content: 0 })
        .sort({ news_id: -1 })
        .limit(10)
        .lean();

        // Get trending/top news for better SEO
        const trendingNews = await allNews.find({
            ne_insight: 'yes',
            post_url: { $ne: slug }
        }, { post_content: 0 })
        .sort({ news_id: -1 })
        .limit(5)
        .lean();

        // Get breaking news


        // Get category-specific latest news for better engagement
        const categoryLatest = await allNews.find({
            post_category: category,
            post_url: { $ne: slug }
        }, { post_content: 0 })
        .sort({ news_id: -1 })
        .limit(6)
        .lean();

        // Get popular news from Tripura category for local relevance
        const tripuraNews = await allNews.find({
            post_category: 'tripura',
            post_url: { $ne: slug }
        }, { post_content: 0 })
        .sort({ news_id: -1 })
        .limit(5)
        .lean();

        // Format published date for better SEO
        let publishedDate;
        try {
            publishedDate = new Date(singleNews.update_date).toISOString();
        } catch (error) {
            publishedDate = new Date().toISOString();
        }

        // Prepare description based on category
        let description;
        if (category === 'article') {
            description = singleNews.meta_description || singleNews.post_name;
        } else {
            const fullDescription = singleNews.meta_description || singleNews.post_name;
            description = fullDescription.length > 60 ? fullDescription.substring(0, 60) + '...' : fullDescription;
        }

        // Prepare SEO-optimized response
        const response = {
            success: true,
            data: {
                article: {
                    ...singleNews,
                    publishedDate: publishedDate,
                    author: singleNews.author || 'Northeast Herald',
                    articleSection: singleNews.post_category,
                    canonicalUrl: `https://www.neherald.com/${category}/${slug}`,
                    breadcrumb: [
                        { name: 'Home', url: 'https://www.neherald.com/' },
                        { name: category.charAt(0).toUpperCase() + category.slice(1), url: `https://www.neherald.com/category/${category}` },
                        { name: singleNews.post_name, url: `https://www.neherald.com/${category}/${slug}` }
                    ]
                },
                relatedNews: relatedNews,
                latestNews: latestNews,
                trendingNews: trendingNews,
                categoryLatest: categoryLatest,
                tripuraNews: tripuraNews,
                seo: {
                    title: `${singleNews.post_name} | Northeast Herald`,
                    description: description,
                    keywords: singleNews.post_keyword || `${category} news, tripura news, northeast herald`,
                    ogImage: singleNews.post_image,
                    ogUrl: `https://www.neherald.com/${category}/${slug}`,
                    publishedTime: publishedDate,
                    modifiedTime: publishedDate,
                    articleTag: singleNews.post_keyword ? singleNews.post_keyword.split(',').map(tag => tag.trim()) : [],
                    category: category
                }
            }
        };

        res.json(response);
    }
    catch(error) {
        console.error('SingleNewsPage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Single News API"
        });
    }
}



exports.TopNewsPageTripura = async(req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const limit = 30;
        const skip = (page - 1) * limit;
        
        const totalNews = await allNews.countDocuments({ne_insight:'yes'});
        const totalPages = Math.ceil(totalNews / limit);
        
        const topheadlines = await allNews.find({ne_insight:'yes'}).sort({news_id:-1}).skip(skip).limit(limit).lean();
        const bnews = await breakingNews.find().sort({brnews_id:-1}).limit('5').lean();
        
        const response = {
            success: true,
            data: {
                topheadlines: topheadlines,
                breakingNews: bnews,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalNews: totalNews,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                    nextPage: page < totalPages ? page + 1 : null,
                    prevPage: page > 1 ? page - 1 : null
                },
                seo: {
                    title: 'Tripura Top News : Northeast Herald',
                    keywords: 'neherald, tripura university,northeast herald, tripura news, kokborok news, tripura info',
                    description: 'Northeast Herald starts its journey from Tripura state capital city Agartala to cover the entire Northeast region of India for the latest news, news photos, and the latest photos to promote the great cultural, historical and traditional identity of the region.',
                    url: 'https://www.neherald.com/',
                    imageCard: 'https://www.neherald.com/logo.png'
                }
            }
        };
        
        res.json(response);
    }
    catch(error) {
        console.error('TopNewsPage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Top News API"
        });
    }
}


exports.TrendingNewsPage = async(req, res) => {
    try {
        console.log('TrendingNewsPage API called');
        
        // Calculate date 3 days ago
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        console.log('Searching for page views since:', threeDaysAgo);
        
        // Get page views from last 3 days and extract news_id from page URLs
        const pageViews = await PageViewModel.find({
            viewedAt: { $gte: threeDaysAgo },
            page: { $regex: /^\/[^\/]+\/[^\/]+/ } // Match pages with category/slug pattern
        }).lean();
        
        console.log('Total page views found:', pageViews.length);
        console.log('Sample page views:', pageViews.slice(0, 5));
        
        // Extract slugs from page URLs and count views
        const pageViewCounts = {};
        
        pageViews.forEach(view => {
            // Count each page view
            pageViewCounts[view.page] = (pageViewCounts[view.page] || 0) + 1;
        });
        
        console.log('Page view counts:', pageViewCounts);
        
        // Sort pages by view count and get top 10
        const sortedPages = Object.entries(pageViewCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        console.log('Top 10 sorted pages:', sortedPages);
        
        // Extract slugs from the trending pages
        const topNewsSlugs = sortedPages.map(([page, count]) => {
            // Extract slug from URL pattern like "/tripura/news-title"
            const urlParts = page.split('/');
            console.log('Processing page:', page, 'URL parts:', urlParts);
            if (urlParts.length >= 3) {
                const slug = urlParts[2]; // Get the news slug (remove category part)
                console.log('Extracted slug:', slug);
                return slug;
            }
            return null;
        }).filter(slug => slug !== null); // Remove any null entries
        
        console.log('Top news slugs extracted:', topNewsSlugs);
        
        // Fetch news articles based on trending slugs from allNews
        const trendingNews = await allNews.find({
            post_url: { $in: topNewsSlugs }
        }).lean();
        
        console.log('Found trending news by post_url:', trendingNews.length);
        
        // If no results with post_url, try with post_name
        let alternativeTrendingNews = [];
        if (trendingNews.length === 0) {
            console.log('No results with post_url, trying with post_name...');
            alternativeTrendingNews = await allNews.find({
                post_name: { $in: topNewsSlugs }
            }).lean();
            console.log('Found trending news by post_name:', alternativeTrendingNews.length);
        }
        
        const finalTrendingNews = trendingNews.length > 0 ? trendingNews : alternativeTrendingNews;
        console.log('Final trending news count:', finalTrendingNews.length);
        
        // Sort news by view count order and add view count
        const sortedTrendingNews = topNewsSlugs.map(slug => {
            const news = finalTrendingNews.find(n => n.post_name === slug || n.post_url === slug);
            if (news) {
                // Find the view count for this slug
                const pageEntry = sortedPages.find(([page]) => {
                    const urlParts = page.split('/');
                    return urlParts.length >= 3 && urlParts[2] === slug;
                });
                const viewCount = pageEntry ? pageEntry[1] : 0;
                
                console.log('Matched news:', news.post_title, 'with view count:', viewCount);
                
                return {
                    ...news,
                    viewCount: viewCount
                };
            }
            console.log('No news found for slug:', slug);
            return null;
        }).filter(news => news !== null); // Remove any null entries
        
        console.log('Final sorted trending news:', sortedTrendingNews.length);
        
        res.json({
            success: true,
            data: {
                trendingNews: sortedTrendingNews
            }
        });
    }
    catch(error) {
        console.error('TrendingNewsPage API Error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Trending News API"
        });
    }
}



exports.GoogleNewsXML = async (req, res) => {
    try {
        // Fetch recent news articles from last 2 days
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        // Convert date to string format that matches the database format (YYYY-MM-DD)
        const twoDaysAgoString = twoDaysAgo.toISOString().split('T')[0];
        
        const articles = await allNews.find({
            update_date: { $gte: twoDaysAgoString }
        }).select('post_name post_url post_category update_date post_title post_keyword').sort({news_id: -1}).limit(150).lean();
        
        res.json({
            success: true,
            data: {
                articles: articles
            }
        });
    } catch (error) {
        console.error('Error fetching Google News data:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Google News API"
        });
    }
};




exports.RSSFeed = async (req, res) => {
    try {
        // Fetch recent news articles from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const articles = await allNews.find({
            update_date: { $gte: sevenDaysAgo }
        }).select('post_name post_url post_category update_date post_summary post_content post_image author').sort({news_id: -1}).limit(150).lean();
        
        res.json({
            success: true,
            data: {
                articles: articles
            }
        });
    } catch (error) {
        console.error('Error fetching RSS feed data:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in RSS Feed API"
        });
    }
};


exports.NewsSitemap = async (req, res) => {
    try {
        // Fetch recent news articles from last 2 days for sitemap
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        // Convert date to string format that matches the database format (YYYY-MM-DD)
        const twoDaysAgoString = twoDaysAgo.toISOString().split('T')[0];
        
        const articles = await allNews.find({
            update_date: { $gte: twoDaysAgoString }
        }).select('post_name post_url post_category update_date post_keyword').sort({news_id: -1}).limit(150).lean();
        
        res.json({
            success: true,
            data: {
                articles: articles
            }
        });
    } catch (error) {
        console.error('Error fetching news sitemap data:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in News Sitemap API"
        });
    }
};



exports.SitemapData = async (req, res) => {
    try {
        // Fetch recent news articles from last 30 days for sitemap
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Convert date to string format that matches the database format (YYYY-MM-DD)
        const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];
        
        const articles = await allNews.find({
            update_date: { $gte: thirtyDaysAgoString }
        }).select('post_name post_url post_category update_date').sort({news_id: -1}).limit(1000).lean();
        
        res.json({
            success: true,
            data: {
                articles: articles
            }
        });
    } catch (error) {
        console.error('Error fetching sitemap data:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Sitemap API"
        });
    }
};

exports.breakingNewsAPI = async (req, res) => {
    try {
        const bnews = await breakingNews.find().select('breaking_title').sort({brnews_id:-1}).limit('5').lean();
        
        res.json({
            success: true,
            data: {
                breakingNews: bnews
            }
        });
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Breaking News API"
        });
    }
};


exports.PhotoAlbumPage = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 24;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalGalleries = await allGallery.countDocuments();
        
        // Fetch galleries with pagination
        const galleries = await allGallery.find({})
            .select('gallery_title gallery_url gallery_path gallery_keyword gallery_description update_date gallery_image')
            .sort({gallery_id: -1})
            .skip(skip)
            .limit(limit)
            .lean();

        // Calculate pagination info
        const totalPages = Math.ceil(totalGalleries / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            success: true,
            data: {
                galleries: galleries,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: totalGalleries,
                    itemsPerPage: limit,
                    hasNextPage: hasNextPage,
                    hasPrevPage: hasPrevPage
                }
            }
        });

    } catch (error) {
        console.error('Error fetching photo gallery:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Photo Gallery API"
        });
    }
};

exports.singleGalleryAPI = async(req, res) => {
    try {
        const url = req.query.gurl;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Gallery URL parameter is required"
            });
        }
        
        const gdata = await allGallery.findOne({gallery_url: url}).lean();
        
        if (!gdata) {
            return res.status(404).json({
                success: false,
                message: "Gallery not found"
            });
        }

        res.json({
            success: true,
            data: {
                gallery: gdata
            }
        });

    } catch (error) {
        console.error('Error fetching single gallery:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Single Gallery API"
        });
    }
};



exports.EpaperHomePage = async(req, res, next) => {
    try{
        const tripuranews = await allNews.find({post_category:'tripura'})
            .select('post_name post_content post_category updated_date')
            .sort({news_id:-1})
            .limit(8)
            .lean();
        
        const nationalnews = await allNews.find({post_category:'national'})
            .select('post_name post_content post_category updated_date')
            .sort({news_id:-1})
            .limit(8)
            .lean();
        
        const internationalnews = await allNews.find({post_category:'world'})
            .select('post_name post_content post_category updated_date')
            .sort({news_id:-1})
            .limit(5)
            .lean();
        
        const sportsnews = await allNews.find({post_category:'sports'})
            .select('post_name post_content post_category updated_date')
            .sort({news_id:-1})
            .limit(5)
            .lean();
        
        const financenews = await allNews.find({post_category:'finance'})
            .select('post_name post_content post_category updated_date')
            .sort({news_id:-1})
            .limit(5)
            .lean();
        
        const showbiznews = await allNews.find({post_category:'showbiz'})
            .select('post_name post_content post_category updated_date')
            .sort({news_id:-1})
            .limit(5)
            .lean();
        
        // Combine all news into single array
        const allEpaperNews = [
            ...tripuranews,
            ...nationalnews,
            ...internationalnews,
            ...sportsnews,
            ...financenews,
            ...showbiznews
        ];
        
        res.json({
            success: true,
            data: allEpaperNews
        });
    }
    catch(error){
        console.error('EpaperHomePage API Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in E-paper API"
        });
    }
}

exports.SearchNewsAPI = async(req, res, next) => {
    try {
        const squery = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Validate search query parameter
        if (!squery) {
            return res.status(400).json({
                success: false,
                message: "Search query parameter is required"
            });
        }

        // Get total count for pagination
        const totalResults = await allNews.countDocuments({$text: {$search: squery}});
        const totalPages = Math.ceil(totalResults / limit);

        // Get search results with pagination (excluding post_content) - sorted by relevance score
        const searchResults = await allNews.find({$text: {$search: squery}}, {score: {$meta: "textScore"}})
            .select('-post_content')
            .sort({score: {$meta: "textScore"}})
            .skip(skip)
            .limit(limit)
            .lean();

        // Get recent news for suggestions (excluding post_content)
        const recentNews = await allNews.find()
            .select('-post_content')
            .sort({news_id: -1})
            .limit(8)
            .lean();

        // Check if search results exist
        if (!searchResults || searchResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No results found for: ${squery}`,
                data: {
                    searchResults: [],
                    recentNews,
                    pagination: {
                        currentPage: page,
                        totalPages: 0,
                        totalResults: 0,
                        hasNextPage: false,
                        hasPrevPage: false,
                        limit: limit
                    }
                }
            });
        }

        res.json({
            success: true,
            data: {
                searchResults,
                recentNews,
                searchQuery: squery,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalResults: totalResults,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                    limit: limit
                }
            }
        });
    } catch(error) {
        console.error('SearchNewsAPI Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in Search API"
        });
    }
}