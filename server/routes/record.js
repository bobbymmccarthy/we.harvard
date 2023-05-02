const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// recordRoutes.route("/search").get(async function (req, res) {
//     // const gened = req.query.gened;
//     // const subjects = req.query.subjects;
//     const agg = [
//       {
//         $search: {
//           index: "myHarvard_index",
//           text: {
//             query: req.query.query, // note the change to use req.query.query instead of req.params.query
//             path: {
//               wildcard: "*"
//             }
//           }
//         },
//       },
//       {
//         $limit: 5,
//       },
//     ];
//     const coll = dbo.getDb("course_catalog").collection("myHarvard");
//     let cursor = coll.aggregate(agg);
  
//     try {
//       const results = await cursor.toArray(); // convert the cursor to an array of results
//       res.json(results); // return the results as the response
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('An error occurred while processing the search request');
//     }
//   });
const genedTypeDict = {'aesthetics-and-culture': "Aesthetics and Culture", 'ethics-and-civics': "Ethics and Civics", "histories-societies-and-individuals": "Histories, Societies, Individuals", "science-and-technology-in-society": "Science and Technology in Society"}

recordRoutes.route("/search").get(async function (req, res) {
    const gened = genedTypeDict[req.query.type];
    const subject = (req.query.subject).toUpperCase();
    console.log('gened')
    console.log(gened)
    console.log('subject')
    console.log(subject)
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
    //   ...(gened ? [
    //     {
    //       $match: {
    //         GenedType: { $in: [gened] }
    //       }
    //     }
    //   ] : []),
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