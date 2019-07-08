//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://dawod331:A0000a0000#@cluster0-tsxqz.mongodb.net/testlist2DB", {
    useNewUrlParser: true
});
// بدايتا ننشء اسكيما جديدة لتعرف المخطط
const itemsSchema = {
    name: String
};
// بعدها نقوم بعمل نموذج للسكيما التي سنمشي بها
const Item = mongoose.model("Item", itemsSchema);
// بعدها نعمل مستندات من النموذح
const item1 = new Item({
    name: "Welcome to your todolist-v2"
});
const item2 = new Item({
    name: "hit a + button to off a new item"
});
const item3 = new Item({
    name: "<-- hit this to delet an item"
});
// بعدها نحفظ المستندات داخل مصفوفة
const defultItems = [item1, item2, item3];
// بعدها نقوم بحفظ المصفوفة -المستندات- داخل الداتا بيز
// في هذه الدالة قمنا باستدعاء الصفحة الرئيسية ثم جلب كل العناصر داهل المصفوفة و وضعنا شرط انه في حال
// كان الصفحة فارعة فانده يقوم بادخال عناصر المصفوفة و يعمل لها رندر
app.get("/", function (req, res) {
    // من اجل ان يجد كل العناصر المدخلة في كل مرة   find هنا الاقواس فارغة في
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Succesfully saved the decument to the database");
                };
            });
            // اعدنا توجيه الصفحة من اجل متابعة الرندر في الاسفل
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        };
    });
});
app.post("/", function (req, res) {
//    هنا قمنا بحفظ المدخل من المستخدم بمتغير ثم حفظنا هذا المتغير داخل مستند في الداتا بيز تم انشاءه 
    const itemInputing = req.body.newItem;
    const itemer = new Item({
        name: itemInputing
    });
    // بعدها نقوم بحفظ المدخلات في المثود
    itemer.save();
    // و بالتالي اعادة ايجاد العناصر في المصفوفة و من ثم رندر على الصفحةfind التي تحويل على get   بعدها نحول المحفوظات الى  ميثود ال
    res.redirect("/");
    // if (req.body.list === "Work") {
    //   workItems.push(item);
    //   res.redirect("/work");
    // } else {
    //   items.push(item);
    //   res.redirect("/");
    // }
});
//هذه دالة حذف العنصر في قاعدة البيانات عند تحديد الcheckbox
app.post("/delete", function (req, res) {
    const checkeditemid = req.body.checkbox;
    Item.findByIdAndRemove(checkeditemid,function(err){
       if( !err){
           console.log("Succesfuly deleted checked item");
//           هنا نضع هذه الدالة لاعادتنا الى الصفحة الرئيسية و رؤية النتيجة
           res.redirect("/")
       } 
    });
});
app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});
app.get("/about", function (req, res) {
    res.render("about");
});
app.listen(3000, function () {
    console.log("Server started on port 3000");
});
