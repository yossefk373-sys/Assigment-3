//==(1)==
//=>The event Loop is a core mechanism in Nodejs that enable nonblocking asynchronous I/O operations
//==(2)==
//=>Libuv is a clibrary used by Nodejs to handle asynchronous I/O operations. It provides the event loop and thread pool
//==(3)==
//=>??
//==(4)==
//=>Call Stack=>Executes synchronous functions in a Last In, First-Out (LIFO) structure.
//=>Event Queue=> Holds asynchronous callbacks ready to be executed in a First In, First-Out (FIFO) structure.
//=>Event Loop=> Monitors the Call Stack when the Call Stack is empty it transfers the first callback from the Event Queue to the Call Stack for execution.
//==(5)==
//=>The Thread Pool is a set of background worker threads provided by Libuv to execute heavy tasks without blocking the main event loop thread
//=>The default size is 4 threads,
//===CRUD===
const express=require("express")
const app=express()
const path=require("node:path")
const fs=require("node:fs")
const { randomUUID } = require("node:crypto")
app.use(express.json())
filepath=path.resolve("./user.json")
function readfile(){
    const data=fs.readFileSync(filepath,"utf-8")
    return JSON.parse(data)
}
function writefile(info){
    fs.writeFileSync(filepath,JSON.stringify(info,null,2))
}

app.post("/user",(req,res,next)=>{
    const {name,email,age}=req.body
    if(!email|| !name){
       return res.status(400).json({message:"email & name both are require"})
    }
  const fileread=readfile()

  const emailexist=fileread.find((user)=>{
    return user.email==email
  })
  if(emailexist){
   return res.status(404).json({message:"email already exist"})
  }
  fileread.push({id:randomUUID(),name,email,age})
  writefile(fileread)
   res.status(200).json({message:"Done",fileread})
})
app.post("/signin",(req,res,next)=>{
    const {email,name}=req.body
    if(!email || !name){
        return res.status(400).json({message:"email & name both are require"})
    }
    const fileread=readfile()
    const userexist=fileread.find((user)=>{
        return user.email==email && user.name==name
    })
    if(userexist){
        return res.status(201).json({message:"login success",fileread})
    }
  res.status(400).json({message:"user not found"})
})
app.patch("/user/:id",(req,res,next)=>{
    const{id}=req.params
    const{email,name,age}=req.body
    const fileread=readfile()
    const idexist=fileread.findIndex((user)=>{
        return user.id==id
    })
    if(idexist==-1){
        return res.status(401).json({message:"id not found"})
    }
    fileread[idexist]={...fileread[idexist],...req.body}
    writefile(fileread)
    return res.status(200).json({message:"update success"})
})
app.delete("/user{/:id}",(req,res,next)=>{
    const id=req.params.id || req.body.id
    const fileread=readfile()
    const idexist=fileread.findIndex((user)=>{
        return user.id==id
    })
    if(idexist==-1){
       return res.status(401).json({message:"id not found"})
    }
    fileread.splice(idexist,1)
    writefile(fileread)
        return res.status(200).json({message:"user delete success"})
})
app.get("/user/getbyname",(req,res,next)=>{
    const {name,email,age}=req.query
    const fileread=readfile()
    const userexist=fileread.find((user)=>{
        return user.name==name
    })
    if(userexist){
        return res.status(200).json({message:"done",userexist})
    }
    
    return res.status(404).json({message:"user name not found"})
})
app.get("/user",(req,res,next)=>{
    res.sendFile(filepath,(err)=>{
        if(err){
            res.status(400).json({message:"error"})
        }else{
            res.json({message:"Done"})
        }
    })
})
app.get("/user/filter",(req,res,next)=>{
    const {minAge,name,email,age}=req.query
    const fileread=readfile()
    const alluser=fileread.filter((user)=>{
return user.age >= Number(minAge);  })
    if(alluser.length==0){
      return  res.status(400).json({message:"user not found"})
    }
        res.status(200).json(alluser)

})
app.get("/user/:id",(req,res,next)=>{
    const{id}=req.params
    const fileread=readfile()
    const getuser=fileread.find((user)=>{
        return user.id==id
    })
    if(getuser){
        return res.status(200).json({message:"done",getuser})
    }
    return res.status(400).json({message:"user not found"})
})











app.use("{/*dum}",(req,res,next)=>{
    res.status(501).json({message:" 501 errrror"})
})
app.listen(3000,()=>{
    console.log(`server run at port:::3000`);
    
})