var express=require("express")
var bodyParser=require("body-parser")
var mongoose=require("mongoose")

const app=express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true });
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/signup",(req,res) => {
    var username= req.body.username
    var email=req.body.email
    var institution=req.body.institution
    var password=req.body.password

    var data={
        "username":username,
        "email":email,
        "institution":institution,
        "password":password
    }
    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('/dashboard.html')
})

app.post("/login", (req, res) => {
    var username = req.body.usename;
    var email = req.body.email;
    var password = req.body.password;

    db.collection('users').findOne({ usename:username,email: email, password: password }, (err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            console.log("Login successful");
            res.redirect('/dashboard.html');
        } else {
            console.log("Invalid email or password");
            const alertScript = `
                <script>
                    alert('Invalid email or password');
                    window.location.href = '/login.html'; // Redirect back to login page
                </script>
            `;
            res.send(alertScript);
        }
    });
});

app.get("/",(req,res) => {
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    return res.redirect('/index.html')
}).listen(3000);

console.log("Listening on port 3000")