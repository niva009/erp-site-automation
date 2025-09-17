      const componySchema = require("../Model/compony");
      const asyncHandler = require("express-async-handler");
      const bcrypt = require('bcryptjs');
      const siteSchema = require("../Model/siteSchema");
      const { spawn } = require("child_process");
      const { sendEmail, sendAdminEmail } = require("./mailController");
      const fs = require('fs');
      const path = require("path");


      const salt = process.env.SALT;



      function makeAbbr(words) {
        words = words.trim();
        const length = words.length;
        let acronym = words[0];

        for (let i = 1; i < length; i++) {
          if (words[i - 1] === ' ' && words[i] !== ' ') {
            acronym += words[i];
          }
        }

        return acronym.toUpperCase();
      }




      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
      const addUserDetails = asyncHandler(async (req, res) => {
        const {
          name,
          email,
          password,
          company_name,
          user_name,
          country,
          phone_number,
          user,
          plan,
          company_address,
        } = req.body;

        console.log("form 1 body", req.body)



        // Validate required fields
        if (!name && !email && !password && !company_name && !user_name) {
          return res.status(400).json({
            message: "name, email, password, company_name, user_name are required",
          });
        }

        if (!validateEmail(email)) {
          return res.status(400).json({
            message: "Invalid email format",
          });
        }

        const abbreviation = makeAbbr(company_name);
        console.log("abbreviation", abbreviation);




        const saltRounds = parseInt(process.env.SALT, 10) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const adduser = new componySchema({
          name,
          email,
          password: hashedPassword,
          plain_password: password,
          company_name,
          user_name,
          country,
          phone_number,
          plan,
          company_address,
          abbreviation,
          user,
        });

        await adduser.save();

        return res.status(201).json({
          message: "Company created successfully",
          data: adduser,
        });
      });



      //////   reserve domains ///////////////////

      const reservedWords = [
        "www", "ftp", "mail", "smtp", "imap", "pop", "ns1", "ns2",
        "admin", "api", "webmail", "autodiscover", "localhost",
        "test", "sandbox", "root", "default", "cpanel", "secure",
        "login", "accounts", "sso", "internal", "payments", "dev",
        "us", "in", "uk", "eu", "home", "web", "portal", "site",
        "main", "blog", "news", "media", "press", "wiki", "events",
        "articles", "shop", "store", "cart", "products", "services",
        "deals", "sale", "offers", "marketplace", "about", "info",
        "contact", "help", "support", "careers", "jobs", "hr",
        "partners", "investors", "signin", "signup", "register",
        "user", "profile", "auth", "authentication", "verify", "mx",
        "newsletter", "lists", "staging", "preprod", "beta", "docs",
        "status", "ci", "cd", "git", "repo", "dashboard", "panel",
        "control", "monitor", "management", "sysadmin", "console",
        "whm", "cloud", "gateway", "vpn", "remote", "app", "apps",
        "db", "database", "storage", "files", "backup", "intranet",
        "private", "gallery", "video", "forum", "community", "whois",
        "dns", "mysql", "pgsql", "oracle", "mssql", "sql", "data",
        "elastic", "es", "kibana", "grafana", "prometheus",
        "administrator", "config", "setup", "access", "identity",
        "token", "faqs", "guide", "manuals", "training", "learn",
        "academy", "school", "library", "research", "team",
        "corporate", "build", "code", "apis", "graph", "graphql",
        "swagger", "doc", "developer", "developers", "alpha",
        "preview", "demo", "logs", "trace", "bug", "auth0", "openid",
        "oauth", "webauthn", "webhooks", "integration", "connect",
        "bridge", "metrics", "health", "alerts", "analytics",
        "reporting", "experiment", "canary", "pipeline", "builds",
        "qa", "helpdesk", "kb", "legal", "terms", "privacy",
        "billing", "invoice", "chat", "messaging", "calls", "voip",
        "cache", "cdn", "edge", "proxy", "global", "api1", "api2",
        "eu-west", "us-east", "temp", "old", "archive", "test1",
        "test2", "devops"
      ];
      



      const siteUrlCreation = asyncHandler(async (req, res) => {
        const componyId = req.params.id;
        console.log("compony id", componyId);

        if (!componyId) {
          return res.status(400).json({
            message: "company id is missing!",
          });
        }

        let { site_url } = req.body;

        if (!site_url) {
          return res.status(400).json({
            message: "sitename is required!",
          });
        }

        sitename = site_url.toLowerCase();
        if (!sitename.includes("erpeaz.org")) {
          sitename = `${sitename}.erpeaz.org`;
        }

        const sitenameExist = await siteSchema.findOne({ site_url: sitename });
        if (sitenameExist) {
          return res.status(409).json({
            message: "sitename already exists",
            sitename: sitename,
          });
        } 

        const rawName = site_url.toLowerCase().replace(".erpeaz.org", "");

        if (reservedWords.includes(rawName)) {
          return res.status(400).json({
            message: "This name is a reserved word, cannot use",
          });
        }

        const site = await siteSchema.create({ site_url: sitename });


        const companyProfile = await componySchema.findByIdAndUpdate(
          componyId,
          { site_url: site._id },
          { new: true }
        );

        if (!companyProfile) {
          return res.status(404).json({ message: "Company not found" });
        }

        return res.status(200).json({
          message: ` ${sitename} created successfully`,
          sitename: sitename,
          siteId: site._id,
          company: companyProfile,
        });
      });


      //---------------------------------------------------------erp next site creation Logic --------------------------------------------------------->


    

      const runCommand = (command, cwd) => {
        return new Promise((resolve, reject) => {
          const [cmd, ...args] = command.split(" ");
          const process = spawn(cmd, args, { cwd, shell: true });

          process.stdout.on("data", (data) => console.log(data.toString()));
          process.stderr.on("data", (data) => console.warn(data.toString()));

          process.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
          });
        });
      };


      const erpssiteCreation = async (req, res) => {
        try {
          const { id } = req.params;
          if (!id) return res.status(400).json({ message: "Company ID is required!" });
      
          const company = await componySchema.findById(id).populate("site_url");
          if (!company) return res.status(404).json({ message: "Company not found" });
      
          const siteName = company.site_url?.site_url;
          if (!siteName) return res.status(400).json({ message: "Site name missing in company" });
      
          const sitePath = path.join("/home/frappe/frappe-bench/sites", siteName);
          if (fs.existsSync(sitePath)) {
            return res.status(400).json({ message: "Site already exists." });
          }
      
          const mysqlRootPassword = process.env.MYSQL_ROOT_PASS || "root";
          const adminPassword = "admin123";
          const siteId = company.site_url._id;
          
          try {
            // Step 1: Create site
            await runCommand(
              `bench new-site ${siteName} --mariadb-root-password ${mysqlRootPassword} --admin-password ${adminPassword}`,
              "/home/frappe/frappe-bench"
            );
      
            if (!fs.existsSync(sitePath)) throw new Error("bench new-site failed: site folder not found");
      
            // Step 2: Install ERPNext
            await runCommand(`bench --site ${siteName} install-app erpnext`, "/home/frappe/frappe-bench");
      
            // Step 3: Install HRMS
            await runCommand(`bench --site ${siteName} install-app hrms`, "/home/frappe/frappe-bench");
      
            // Step 4: Install Payments
            await runCommand(`bench --site ${siteName} install-app payments`, "/home/frappe/frappe-bench");
      
            // Step 5: Install Company app
            await runCommand(`bench --site ${siteName} install-app compony`, "/home/frappe/frappe-bench");
      
            // Step 6: Create company record
            await runCommand(
              `bench --site ${siteName} execute compony.compony.api.create_company --args '["${company.name}", "${company.abbreviation}", "${company.country || "India"}"]'`,
              "/home/frappe/frappe-bench"
            );
      
         
            console.log("Installing erpeaz_uae...");
            try {
              await runCommand(`bench --site ${siteName} install-app erpeaz_uae`, "/home/frappe/frappe-bench");
            } catch (err) {
              console.warn("erpeaz_uae installation failed (likely gstin conflict). Continuing...");
            }
      
            console.log("Checking and removing conflicting gstin field...");
            await runCommand(
              `bench --site ${siteName} execute compony.compony.api.remove_gstin_field`,
              "/home/frappe/frappe-bench"
            );

            if (company.country === "India") {
              console.log("Installing india_compliance...");
              await runCommand(`bench --site ${siteName} install-app india_compliance`, "/home/frappe/frappe-bench");
            }else if (company.country === "Saudi Arabia") {
              console.log("Installing saudi_compliance...");
              await runCommand(`bench --site ${siteName} install-app zatca_erpgulf`, "/home/frappe/frappe-bench");
            } 
      
            await runCommand(`bench --site ${siteName} migrate`, "/home/frappe/frappe-bench");


            const planRoleMap = {
              Professional: "Standard IT Admin",
              Ultimate: "Ultimate Service Admin",
              Basic: "Basic Plan General Trading User",
            };
            
            
            const plan = (company.plan || "").trim();
            const roleForPlan = planRoleMap[plan] || "Standard IT Admin";
            const roles = [roleForPlan];


            const defaultUser = {
              email: company.email || "admin@" + siteName,
              fullName: company.user_name,
              password: company?.plain_password || "User@123",  
              roles: roles,
              company: company.company_name,
            };


            

              await runCommand(
                `bench --site ${siteName} execute compony.compony.api.create_default_user --args '["${defaultUser.email}", "${defaultUser.fullName}", "${defaultUser.password}", ${JSON.stringify(defaultUser.roles)}, "${defaultUser.company}"]'`,
                "/home/frappe/frappe-bench"
              );

              console.log("compony url", company.site_url);

              await sendEmail(company.email, company.email, company.plain_password, company.site_url?.site_url);
              await sendAdminEmail(company.site_url, company.user_name);

              
            // Step 9: Setup Nginx and SSL
            await runCommand(
              `yes | bench setup nginx`,
              "/home/frappe/frappe-bench"
            );

            // No --email needed in new bench
            await runCommand(
              `yes | sudo bench setup lets-encrypt ${siteName}`,
              "/home/frappe/frappe-bench"
            );

              
            
            // Step 10: Mark site as completed
            await siteSchema.findByIdAndUpdate(siteId, { status: "completed" });
      
            return res.status(200).json({
              message: "ERPNext site with HRMS, Payments, Company & erpeaz_uae created successfully",
              siteName,
            });
      
          } catch (err) {
            console.error(`Site creation failed for ${siteName}:`, err.message);
      
            if (fs.existsSync(sitePath)) {
              console.log("Site folder exists despite error, marking as completed");
              await siteSchema.findByIdAndUpdate(siteId, { status: "completed" });
      
              return res.status(200).json({
                message: "ERPNext site created successfully (with warnings)",
                siteName,
              });
            }
      
            await siteSchema.findByIdAndUpdate(siteId, { status: "error" });
      
            return res.status(500).json({
              message: "Site creation failed",
              error: err.message,
            });
          }
        } catch (err) {
          console.error("Server error:", err);
          return res.status(500).json({ message: "Internal server error", error: err.message });
        }
      };
      
      

      const siteDetails = asyncHandler(async (req, res) => {

        const siteDetails = await componySchema.find({}).populate("site_url");

        if (!siteDetails) {
          return res.status(400).json({
            message: "sites not found"
          });
        }

        return res.status(200).json({
          message: "site details",
          data: siteDetails
        })

      });

      const statusInfomation = asyncHandler(async (req, res) => {

        const { id } = req.params;
        console.log("id", id)
        const company = await componySchema.findById(id).populate("site_url");
        console.log("compony", company);

        if (!company) {
          return res.status(404).json({ message: "Company not found" });
        }

        const site = company.site_url;
        if (!site) {
          return res.json({ status: "pending", progress: 0 });
        }

        res.json({
          status: site.status || "pending",
          progress: site.progress || 0,
        });
      });





      module.exports = { addUserDetails, siteUrlCreation, erpssiteCreation, siteDetails, statusInfomation };
