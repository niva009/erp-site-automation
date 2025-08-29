        const express = require("express");
        const ComponyRouter = express.Router(); 
        const { addUserDetails,siteUrlCreation, erpssiteCreation ,siteDetails, statusInfomation} = require("../Controllers/componycontroller");


        // POST route
        ComponyRouter.post("/addcompony", addUserDetails);
        ComponyRouter.post('/addsiteurl/:id', siteUrlCreation)
        ComponyRouter.post('/createnewsite/:id', erpssiteCreation);
        ComponyRouter.get('/site-details', siteDetails);
        ComponyRouter.get('/status-tracker/:id', statusInfomation);





        module.exports = ComponyRouter;
