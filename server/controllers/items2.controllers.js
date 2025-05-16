/* eslint-disable no-undef */
import Item from "../utils/item.model.js";

export const getItems = async(req, res ) =>{
    const items = await Item.find();
    res.json(items);
};

export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(404).json({ message: "Item not found" });
  }
};

export const postItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: "Error creating item", error: error.message });
  }
};

    
export const putItem = async(req, res ) =>{
    const item = await Item.findByidAndUpdate(req.params.id,req.body, {
            new:true
        });
    res.json(item);
    }

export const deleteItem = async(req, res ) =>{
    await Item.findByidAndDelete(req.params.id);
    res.status(200).json({message:"Item eliminado"});
    }