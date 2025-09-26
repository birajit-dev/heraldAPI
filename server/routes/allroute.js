const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const allController = require('../controller/allcontroller');
const adminController = require('../controller/admincontroller');
const galleryController = require('../controller/galleryController');
const ibnsAutomation = require('../controller/ibnsScheduler');
const sessions = require('express-session');
const ibns = require('../model/ibns');
const RssFeed = require('../controller/rsscontroller');
const SitemapGenerator = require('../controller/sitemapController');
const API = require('../controller/API');

// CLIENT SIDE ROUTE - ALL REDIRECTED TO 404 //
router.get('/', allController.Error); // HOMEPAGE -> 404
router.get('/:cate/:id', allController.Error); // NEWS PAGE -> 404
router.get('/:cat', allController.Error); // CATEGORY PAGE -> 404
router.get('/en/pages/:pageurl', allController.Error); // PAGES -> 404
router.get('/photo/neh/gallery/:gurl', allController.Error); // GALLERY -> 404
router.get('/topnews/headlines/tripura', allController.Error); // TOP NEWS -> 404
//router.get('/automation/ibns/all', adminController.ibns);
//router.get('/a/a/a/test', adminController.testi);

//ADMIN SIDE ROUTE//
router.get('/admin/user/dashboard', adminController.adminDashboard);
router.get('/admin/user/login', adminController.adminLogin);
router.get('/admin/user/addnews', adminController.addNews);
router.get('/admin/user/editnews/:id', adminController.editNews); //EDIT NEWS
router.get('/admin/user/addpages', adminController.addPage);
router.get('/admin/user/pagedashboard', adminController.pageDashboard);
router.get('/admin/user/editpage/:id', adminController.editPage);
router.get('/admin/user/addbreaking', adminController.breakingPage);
router.get('/admin/user/listbreaking', adminController.listBreaking);
router.get('/admin/user/editbreaking/:id', adminController.editBreaking)
router.get('/admin/user/addgallery', galleryController.addGallery);
router.get('/admin/user/gallery', galleryController.listGallery);
router.get('/admin/user/addauthor', adminController.addAuthorPage);

//API//
router.post('/admin/user/authcheck', adminController.authAdmin); //AUTHENTICATION OF ADMIN PANEL LOGIN
router.post('/admin/user/postnews', adminController.postNews); // ADD NEWS
router.post('/admin/user/postimage', adminController.upImage); // IMAGE UPLOADER
router.post('/admin/user/updatenews', adminController.updateNews); // EDIT NEWS
router.post('/admin/user/pagepost', adminController.postPage);
router.post('/admin/user/updatepage', adminController.updatePage);
router.post('/admin/user/breaknews', adminController.brNews);
router.post('/admin/user/updatebreaking', adminController.updateBreaking)
router.post('/admin/user/gallerypost', galleryController.postGallery);
router.get('/admin/user/deletenews/:id', adminController.deleteNews);
router.get('/admin/user/deletegallery/:id', adminController.deleteGallery);
router.get('/admin/user/deletebreaking/:id', adminController.deleteBreaking);







//Generator - ALL REDIRECTED TO 404 //
router.get('/automate/generate/ibns', allController.Error);
router.get('/automate/generate/rss', allController.Error);








//SEO 

//API - ALL REDIRECTED TO 404 //
router.get('/api/v1/search', allController.Error);
router.get('/api/v1/album', allController.Error);
router.get('/api/v1/video', allController.Error);
router.get('/api/v1/load-more', allController.Error);
router.get('/api/v1/trending', allController.Error);
router.get('/api/v1/related/:category/:id', allController.Error);

router.get('/api/v1/allnews', allController.Error);





router.post('/api/v1/controller/pageview', adminController.getPageViews);


router.post('/subscribe', adminController.saveSubscription);
router.post('/send', adminController.sendNotification);
router.get('/push-not/notification/direct', allController.pushPage);


//ERROR//
router.get('/error/notfound/404', allController.Error);



//API for NEXT JS Website
router.get('/api/next/v1/breaking', API.breakingNewsAPI);
router.get('/api/next/v1/tripura', API.TripuraHomePage);
router.get('/api/next/v1/national', API.NationalHomePage);
router.get('/api/next/v1/international', API.InternationalHomePage);
router.get('/api/next/v1/sports', API.SportsHomePage);
router.get('/api/next/v1/finance', API.FinanceHomePage);
router.get('/api/next/v1/showbiz', API.ShowbizHomePage);
router.get('/api/next/v1/northeast', API.NortheastHomePage);
router.get('/api/next/v1/article', API.ArticleHomePage);
router.get('/api/next/v1/health', API.HealthHomePage);
router.get('/api/next/v1/youtube', API.YoutubeHomePage);
router.get('/api/next/v1/gallery', API.GalleryHomePage);
router.get('/api/next/v1/topnews', API.TopNewsPage);
router.get('/api/next/v1/category', API.CategoryNewsPage);
router.get('/api/next/v1/single', API.SingleNewsPage);
router.get('/api/next/v1/topnewstripura', API.TopNewsPageTripura);
router.get('/api/next/v1/trending', API.TrendingNewsPage);
router.get('/api/next/v1/googlenews', API.GoogleNewsXML);
router.get('/api/next/v1/rss', API.RSSFeed);
router.get('/api/next/v1/newsitemap', API.NewsSitemap);
router.get('/api/next/v1/sitemap', API.SitemapData);
router.get('/api/next/v1/photoalbum', API.PhotoAlbumPage);
router.get('/api/next/v1/gallery/single', API.singleGalleryAPI);
router.get('/api/next/v1/epaper', API.EpaperHomePage);
router.get('/api/next/v1/search', API.SearchNewsAPI);













module.exports = router;
