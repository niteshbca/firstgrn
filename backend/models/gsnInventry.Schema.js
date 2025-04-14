




const mongoose = require('mongoose');

// Schema for each table row
const tableDataSchema = new mongoose.Schema({
  item: {
    type: String,
    
  },
  description: {
    type: String,
   
  },
  quantityNo: {
    type: Number,
   
  },
  quantityKg: {
    type: Number,
   
  },
}, { _id: false }); 

const entrySchema = new mongoose.Schema({
  grinNo: {
    type: String,
    required: true,
  },
  grinDate: {
    type: Date,
    required: true,
  },
  gsn: {
    type: String,
    required: true,
  },
  gsnDate: {
    type: Date,
    required: true,
  },
  poNo: {
    type: String,
    required: true,
  },
  poDate: {
    type: Date,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  innoviceno: {
    type: String,
    required: true,
  },
  innoviceDate: {
    type: Date,
    required: true,
  },
  lrNo: {
    type: String,
    required: true,
  },
  lrDate: {
    type: Date,
    required: true,
  },
  transName: {
    type: String,
    required: true,
  },
  vehicleNo: {
    type: String,
    required: true,
  },
  file: {
    type: String, // File path or URL
    required: true,
  },
  PurchaseManagerSigned: {
    type: Boolean,
    default: false,
  },
  isHidden: { 
    type: Boolean, 
    default: false 
  },
  createdBy:{
    type:String
  },
  StoreManagerSigned: {
    type: Boolean,
    default: false,
  },
  GeneralManagerSigned: {
    type: Boolean,
    default: false,
  },
  AccountManagerSigned: {
    type: Boolean,
    default: false,
  },
 
  tableData: [tableDataSchema], // Array of tableData objects
}, { timestamps: true });

const gsnEntries = mongoose.model('gsnEntries', entrySchema);

module.exports = gsnEntries;
