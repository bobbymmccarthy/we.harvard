const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 

const genedTypeDict = {'aesthetics-and-culture': "Aesthetics and Culture", 'ethics-and-civics': "Ethics and Civics", "histories-societies-and-individuals": "Histories, Societies, Individuals", "science-and-technology-in-society": "Science and Technology in Society"}

/*
    CONCEPT: Catalog
    ACTION: search()
    DESC: searches through catalog according to query; if subject is defined then search is filtered for subject match
*/
recordRoutes.route("/search").get(async function (req, res) {
    const gened = genedTypeDict[req.query.type];
    const subject = (req.query.subject);

    const agg = [
      {
        $search: {
          index: "extendedSearch",
          text: {
            query: req.query.query,
            path: {
              wildcard: "*"
            },
            // fuzzy: {
            //     maxEdits: 1
            // }
          }
        }
      },
      ...(subject ? [
        {
          $match: {
            subject: subject
          }
        }
      ] : []),
    ];
    const coll = dbo.getDb("course_catalog").collection("myHarvardExtended");
    let cursor = coll.aggregate(agg);
    
    try {
      const results = await cursor.toArray();
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while processing the search request');
    }
  });

  // Endpoint for internal search via course ID
  recordRoutes.route("/private_search").get(async function (req, res) {
    const class_id = parseInt(req.query.id);
    const coll = dbo.getDb("course_catalog").collection("myHarvard");
    const query = { externalId: class_id };

    try {
        const result = await coll.findOne(query);
        res.json(result)
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while processing the search request');
    }
  });

/*
    CONCEPT: Catalog
    ACTION: filter()
    DESC: filters catalog per specified GenedType
*/

  // Endpoint for retreiving all courses by subject
  recordRoutes.route("/gened").get(async function (req, res) {

    const gened_type = genedTypeDict[req.query.type];
    const coll = dbo.getDb("course_catalog").collection("myHarvardExtended");
    const query = { GenedType: { $in: [gened_type] } };
  
    try {
      const cursor = coll.find(query);
      const results = await cursor.toArray();
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while processing the search request');
    }
  });


/*
    CONCEPT: Catalog
    ACTION: filter()
    DESC: filters catalog per specified Subject
*/

  // Endpoint for retreiving all courses by subject
  recordRoutes.route("/subject").get(async function (req, res) {
    const sub = req.query.type;
    const coll = dbo.getDb("course_catalog").collection("myHarvardExtended");
    const query = { subject: sub };
  
    try {
      const cursor = coll.find(query);
      const results = await cursor.toArray();
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while processing the search request');
    }
  });
  
 
module.exports = recordRoutes;