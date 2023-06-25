let members = [];
let userList;
let parts = ["Soprano","Alto","Tenor","Bass"];
let options = {
    valueNames: ['last','first','part','key','partsort'],
    item: function(V) {
        console.debug(V.key,getImage(V.key));
        return `<li class="${V.part}">
<label class="upload">
<div class="instructions"></div>
<input type="file" id="${V.key}" accept="image/*" capture="user"/>
<img src="${getImage(V.key)}">
</label>
<div><span class="first">${V.first}</span> <span class="last">${V.last}</div>
<div class="part">${V.part}</div></li>`;
    }
}
let photos=[];
function getImages() {
    $.ajax({url:"photos.cgi",
	    type: "GET",
	    async:false,
	    success: (data) => {
		photos = data.split("\n").map((x)=>x.trim());
	    }
	   });
}
function getImage(key){
    let dir = "photos";
    let path = `${dir}/${key}`;
    let exists=null;
    
    let name = photos.filter((elem,index)=>elem.startsWith(key));
    name = name[0]??"unknown.jpg";
    return `${dir}/${name}`;
}
function readRoster() {
    $.ajax({
        url: "roster.txt",
        method: "GET",
        datatype: "text/plain",
    }).done((data) => {
        let result = {};
        for (let line of data.split("\n")) {
            let [last,first,part] = line.split(",").map((x)=>{return x.trim();})
            if (!last) {continue;}
            let key = last+","+first;
            let partsort = {S: 0, A: 1, T: 2, B: 3}[part]; //not shown, used for sorting
            part = {S: "Soprano", A: "Alto", T: "Tenor", B: "Bass"}[part];
            result[key] = {last: last, first: first, part: part, partsort: partsort, key: encodeURI(key)};
        }
        members = result;
        console.debug(Object.values(members)[0]);
        userList = new List('members', options, Object.values(members));
        $(".upload input").on("change",upload);

    });
};
function sortButton(e) {
    let type = $(e.target).attr('data-sort');
    $("h2").remove();
    if(type == "partsort") {
        let firsts = {};
        for(let part of parts){
            firsts[part] = $($(`.${part}`)[0]);
        }
        console.debug(firsts);
        setTimeout(() => {
        for (let part of parts){
            $(`<h2>${part}</h2>`).insertBefore(firsts[part]);
        }
        },100);
    }
}
function upload(e) {
    let tgt = e.target;
    let files = e.target.files;
    let key = $(e.target).attr("id");
    let img = $(e.target).siblings("img");
    let formData = new FormData()
    formData.append("key",key);
    formData.append("file",files[0]);
    formData.append("extension",files[0].name.split(".").slice(-1)[0]);
    $(tgt).parent().css("opacity",0.5);
    $(tgt).siblings("img").attr("src","photos/loading.png");
    $.ajax({method: "POST",
            url: "upload.cgi",
            data: formData,
            processData: false,
	    contentType: false,
	   }).done((response) => {
               console.debug(response);
	       $(tgt).parent().css("opacity",1);
	       getImages();
	       console.debug(photos);
	       $(tgt).siblings("img").attr("src",getImage(key));
           }).fail((response) => {
	       $(tgt).parent().css("opacity",1.0);
	       $(tgt).siblings("img").attr("src",getImage(key));
	   });

}
function init() {
    getImages();
    readRoster();
    $(".sort").on("click",sortButton);
}
$(init);
