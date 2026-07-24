import type { Request, Response } from "express";
import * as queries from "../db/queries"
import {getAuth} from "@clerk/express"

export const createComment = async(req:Request, res:Response)=>{
    try{
        const {userId} = getAuth(req);
        if(!userId) return res.status(401).json({error: "Unauthorized"});

        const productId = typeof req.params.productId === "string"
            ? req.params.productId
            : Array.isArray(req.params.productId)
                ? req.params.productId[0]
                : undefined;
        const {content} = req.body;

        if(!content) return res.status(400).json({error:"Comment content is required"});
        if(!productId) return res.status(400).json({error:"Product ID is required"});

        const product = await queries.getProductById(productId)
        if(!product) return res.status(404).json({error:"Product not found"});

        const comment = await queries.createComment({
            content,
            userId,
            productId
        })
        res.status(201).json(comment)

    }catch(error){
        console.error("Error creating comment: ", error)
        res.status(500).json({error:"Failed to create comment"})
    }
}

export const deleteComment = async(req:Request, res:Response) =>{
    try{
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({error:"Unauthorized"});

        const commentId = typeof req.params.commentId === "string"
            ? req.params.commentId
            : Array.isArray(req.params.commentId)
                ? req.params.commentId[0]
                : undefined;

        if(!commentId) return res.status(400).json({error:"Comment ID is required"});

        const existingComment = await queries.getCommentById(commentId)

        if(!existingComment) return res.status(404).json({error:"Comment not fount"});

        if(existingComment.userId !== userId){
            return res.status(403).json({error:"You can only delete your own comments"})
        }
        await queries.deleteComment(commentId)
        res.status(200).json({message:"Comment deleted succesfully"})

    }catch(error){
        console.error("Error deleting comment: ", error)
        res.status(500).json({error:"Failed to delete comment"})
    }
}
