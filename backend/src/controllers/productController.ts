import type {Request, Response} from 'express'

import * as queries from "../db/queries"
import {getAuth} from '@clerk/express'
import { desc } from 'drizzle-orm';

export const getAllProduct = async(req:Request, res:Response) =>{
    try{
        const product = await queries.getAllProducts();
        res.status(200).json(product)
    }catch(error){
        console.error("Error getting products: ", error)
        res.status(500).json({error: "Failed to get product"})
    }
}

export const getProductById = async(req:Request, res:Response) =>{
    try{
        const {id} = req.body()
        const product = await queries.getProductById(id)
        if(!product){
            return res.status(404).json({error:"Product not found"})
        }
        res.status(200).json(product)
    }catch(error){
        console.error("Error getting product: ", error)
        res.status(500).json({error: "Failed to get product"})
    }
}

export const getMyProducts = async(req:Request, res: Response) =>{
    try{
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({error: "Unauthorized"});

        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    }catch(error){
        console.error("Error getting user Products", error)
        res.status(500).json({error: "Faild to get user products"})
    }
}

export const createProduct = async(req: Request, res:Response) =>{
    try{
        const {userId} = getAuth(req);
        if(!userId) return res.status(401).json({error: "Unauthorized"});

        const {title, description, imageUrl} = req.body;
        if(!title || !description || !imageUrl){
            res.status(400).json({error: "Title ,Description, imageUrl are required" });
            return 
        }
        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId
        })

        res.status(201).json(product);
    }catch(error){
        console.error("Error creating products: ", error)
        res.status(500).json({error: "Failed to create product"})
    }
}

export const updateProduct = async(req:Request, res:Response) =>{
    try{
        const {userId} = getAuth(req);
        if(!userId) return res.status(401).json({error: "Unauthorized"});

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;
        if(!id) return res.status(400).json({error: "Product id is required"});

        const {title, description, imageUrl} = req.body

        const existingProduct = await queries.getProductById(id);
        if(!existingProduct){
            return res.status(404).json({error: "Product not found"});
        }
        if (existingProduct.userId !== userId){
            res.status(403).json({error: "You can only update your own products"})
            return;
        }

        const product = await queries.updateProduct(id,{
            title,
            description,
            imageUrl
        })

        res.status(200).json(product);
    }catch(error){
        console.error("Error updating product: ", error)
        res.status(500).json({error: "Failed to update product"})
    }
}

export const deleteProduct = async(req:Request, res:Response) =>{
    try{
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({error: "Unauthraized"});

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;
        if(!id) return res.status(400).json({error: "Product id is required"});
        
        const existingProduct = await queries.getProductById(id)
        if(!existingProduct){
            res.status(404).json({error: "Product not found"})
            return
        }
        if(existingProduct.userId !== userId){
            res.status(403).json({error: "You can only delete your own product"})
            return 
        }
        await queries.deleteProduct(id)
        res.status(200).json({message: "Product deleted successfully"})

    }catch(error){
        console.error("Error detecting product: ", error)
        res.status(500).json({error:"Faild to delete product"})
    }
}