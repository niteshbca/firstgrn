const gsnEntries = require('../models/gsnInventry.Schema')
const jwt = require('jsonwebtoken')
require("dotenv").config()
const gsnHandler = {

    uploaddata:
        async function (req, res) {
            try {
             console.log(req.body)
                const { grinNo, grinDate, gsn, gsnDate, poNo, poDate, partyName, innoviceno, innoviceDate, receivedFrom, lrNo, lrDate, transName, vehicleNo, file, materialInfo, tableData } = req.body
                console.log("file name is....",req.file)
                const filePath = `gsnfiles/${req.file.filename}`
                console.log("new path is.......", filePath)

                const existData = await gsnEntries.findOne({ grinNo })
                if (!existData) {
                    const newInventory = new gsnEntries({
                        grinNo,
                        grinDate,
                        gsn,
                        gsnDate,
                        poNo,
                        poDate,
                        partyName,
                        innoviceno,
                        innoviceDate,
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
            console.log("Fetching GSN entries...");
            console.log("Request headers:", req.headers);
            console.log("Request user:", req.user);
            
            const data = await gsnEntries.find();
            console.log("Found GSN entries:", data);
            
            if (!data || data.length === 0) {
                console.log("No GSN entries found");
                return res.status(200).json([]);
            }
            
            return res.status(200).json(data);
        } catch (err) {
            console.error("Error in getting GSN entries:", err);
            return res.status(500).json({ message: "Error fetching GSN entries", error: err.message });
        }
    },





    updateVerificationStatus: async function (req, res) {
        console.log("request from the fronend coming........", req.body)
        const { _Id, managerType, status,isHidden } = req.body;


        const managerFieldMap = {
            'General Manager': 'GeneralManagerSigned',
            'Store Manager': 'StoreManagerSigned',
            'Purchase Manager': 'PurchaseManagerSigned',
            'Account Manager': 'AccountManagerSigned',
            'isHidden':'isHidden'
        };


        try {
            // Determine the field to update based on the managerType
            // const updateField = `${managerType}Signed`;
            const updateField = managerFieldMap[managerType];

            // Update the document
            const result = await gsnEntries.findByIdAndUpdate(_Id, 
                { 
                    [updateField]: status === 'checked',
                    isHidden: isHidden  // Set isHidden based on status 
                },
                 { new: true });

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

module.exports = gsnHandler
