const Entries = require('../models/inventory.schema')
const jwt = require('jsonwebtoken')
const gsnEntries = require('../models/gsnInventry.Schema')

require("dotenv").config()

const handler = {

    uploaddata:
        async function (req, res) {
            try { 
                console.log(req.body)
                const { grinNo, grinDate, gsn, gsnDate, poNo, poDate, partyName, innoviceno, innoviceDate, receivedFrom, lrNo, lrDate, transName, vehicleNo, file, materialInfo, tableData } = req.body
                const filePath = `files/${req.file.filename}`
                console.log("new path is.......", filePath)

                const existData = await Entries.findOne({ grinNo })
                if (!existData) {
                    const newInventory = new Entries({
                        grinNo,
                        grinDate,
                        gsn,
                        gsnDate,
                        poNo,
                        poDate,
                        partyName,
                        innoviceno,
                        innoviceDate,
                        receivedFrom,
                        lrNo,
                        lrDate,
                        transName,
                        vehicleNo,
                        file: filePath,// Assuming you're handling file upload elsewhere
                        materialInfo,
                        tableData: JSON.parse(tableData)
                    });
                    await newInventory.save()
                    res.status(201).json({ message: 'Inventory added successfully', inventory: newInventory });
                }
                else {
                    return res.status(300).send({ message: "dupplicate entry found" })
                }
            } catch (err) {
                console.error("Error in adding datails", err);
                res.status(500).json({ message: 'Server error' });
            }
        },
    getting: async function (req, res) {
        try {
            const data = await Entries.find()

            if (!data) {
                return res.send(404).send("data not found")
            }
            const token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: "1hr" })

            return res.status(200).send(data);
        } catch (err) {
            return res.status(404).send("error in fetching")
        }
    },




    // updateVerificationStatus: async function (req, res) {
    //     console.log("Request from the frontend coming........", req.body);
    //     const { _Id, managerType, status, isHidden } = req.body;

    //     const managerFieldMap = {
    //         'General Manager': 'GeneralManagerSigned',
    //         'Store Manager': 'StoreManagerSigned',
    //         'Purchase Manager': 'PurchaseManagerSigned',
    //         'Account Manager': 'AccountManagerSigned',
    //         'isHidden': 'isHidden'
    //     };

    //     try {
    //         // Determine the field to update based on the managerType
    //         const updateField = managerFieldMap[managerType];

    //         // Prepare update payload
    //         const updatePayload = {
    //             [updateField]: status === 'checked',
    //         };

    //         // Include `isHidden` only if it exists in the request body
    //         if (typeof isHidden !== 'undefined') {
    //             updatePayload.isHidden = isHidden;
    //         }

    //         // Update the document
    //         const result = await gsnEntries.findByIdAndUpdate(
    //             _Id,
    //             updatePayload,
    //             { new: true } // Return the updated document
    //         );

    //         console.log(result);
    //         if (!result) {
    //             return res.status(404).json({ message: 'Item not found' });
    //         }

    //         return res.status(200).json({ 
    //             message: 'Verification status updated successfully', 
    //             data: result 
    //         });
    //     } catch (err) {
    //         console.error("Error updating verification status", err);
    //         return res.status(500).json({ message: 'Server error' });
    //     }
    // }



//     updateVerificationStatus: async function (req, res) {
//         console.log("request from the fronend coming........")
//         const { _Id, managerType, status, isHidden } = req.body;
// console.log(_Id, managerType, status, isHidden)

//         const managerFieldMap = {
//             'General Manager': 'GeneralManagerSigned',
//             'Store Manager': 'StoreManagerSigned',
//             'Purchase Manager': 'PurchaseManagerSigned',
//             'Account Manager': 'AccountManagerSigned',
//             'isHidden': 'isHidden'
//         };


//         try {

//             const updateField = managerFieldMap[managerType];

//             // Update the document
//             const result = await Entries.findByIdAndUpdate(_Id,
//                 {
//                     [updateField]: status === 'checked',
//                     isHidden: isHidden  // Set isHidden based on status 
//                 },
//                 { new: true });
            
//             if (!result) {
//                 return res.status(404).json({ message: 'Item not found' });
//             }

//             return res.status(200).json({ message: 'Verification status updated successfully', data: result });
//         } catch (err) {
//             console.error("Error updating verification status", err);
//             return res.status(500).json({ message: 'Server error' });
//         }
//     }
updateVerificationStatus: async function (req, res) {
    console.log("request from the frontend coming........");
    const { _Id, managerType, status, isHidden } = req.body;
    console.log(_Id, managerType, status, isHidden);
  
    // Mapping for manager types to their corresponding field names
    const managerFieldMap = {
      'General Manager': 'GeneralManagerSigned',
      'Store Manager': 'StoreManagerSigned',
      'Purchase Manager': 'PurchaseManagerSigned',
      'Account Manager': 'AccountManagerSigned'
    };
  
    try {
      const updateField = managerFieldMap[managerType];
      
      if (!updateField) {
        return res.status(400).json({ message: "Invalid manager type" });
      }
  
      // Build the update object conditionally
      const updateObj = {
        [updateField]: status === 'checked'
      };
  
      // Only add isHidden if it is defined in the request
      if (typeof isHidden !== 'undefined') {
        updateObj.isHidden = isHidden;
      }
  
      // Update the document with the constructed updateObj
      const result = await gsnEntries.findByIdAndUpdate(_Id, updateObj, { new: true });
      
      if (!result) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      return res.status(200).json({ message: 'Verification status updated successfully', data: result });
    } catch (err) {
      console.error("Error updating verification status", err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  



}

module.exports = handler
