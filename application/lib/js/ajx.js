
// AJAX METHOD ---------------------------------------------------------------->
function ajx(obj) {
  // type, url, data, success, complete, err, load, loaderID, area
  if (!obj.hasOwnProperty('type')) return "No request type!";
  let type = obj.type;

  if (!obj.hasOwnProperty('url')) return "No request url!";
  const url = obj.url;

  if (!obj.hasOwnProperty('data')) return "No request parameter given!";
  let data = obj.data;

  if (!obj.hasOwnProperty('success')) return "No request parameter given!";
  let success = obj.success;

  let complete = (obj.complete || undefined);
  let err = (obj.errorMessage || undefined);

  let errMethod = (obj.errorMethod || undefined);

  let header_accepts = (obj.accepts || undefined);

  let contentType = (obj.contentType || undefined);

  let timeOut = (!obj.hasOwnProperty('timeOut')) ? ()=>{swal({ icon: "error", title: "Server timedout", text: "There seems to be a problem with the internet connection." });} : obj.timeOut;

  let timer = (obj.timer || 10000);

  if (!obj.hasOwnProperty('load')) return "No load option";
  let load = obj.load;


  let loaderID = (!obj.hasOwnProperty('loaderID')) ? crtEvnt() : obj.loaderID;

  let area = (!obj.hasOwnProperty('area')) ? "width" : obj.area;

  // ajaxProcess[JSON.stringify(loaderID)] = $.ajax({
  $.ajax({
    xhr: function()
    {
      let xhr = new window.XMLHttpRequest();
      switch (load) {
        case 'up':
          //Upload progress
          xhr.upload.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
              let percentComplete = evt.loaded / evt.total;
              //Do something with upload progress
              let percentFinish = ((evt.loaded / evt.total) * 100);
              // console.log("UPLOADING => "+percentComplete);
              if ($("#"+loaderID)) {
                if (area == "height") {
                  $("#"+loaderID).css('height', percentFinish + '%');
                } else if (area == "width") {
                  $("#"+loaderID).css('width', percentFinish + '%');
                }
              }
            }
          }, false);
          break;

        case 'down':
          //Download progress
          xhr.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              let percentComplete = evt.loaded / evt.total;
              //Do something with download progress
              let percentFinish = ((evt.loaded / evt.total) * 100);
              // console.log("DOWNLOADING => "+percentComplete);
              if ($("#"+loaderID)) {
                if (area == "height") {
                  $("#"+loaderID).css('height', percentFinish + '%');
                } else if (area == "width") {
                  $("#"+loaderID).css('width', percentFinish + '%');
                }
              }
            }
          }, false);
          break;
        default:

      }
      return xhr;
    },
    type: type,
    url: url,
    data: data,
    contentType: contentType,
    success: function(result) {
      if (isJson(result)) {
        let res = JSON.parse(result);
        if (res.session_id == "") {
          swal({icon: "error",title: "error",text: "Session expired, please log in again"});
          return false;
        }
      }
      success(result);
    },
    complete: function() {
      if (complete != undefined) complete();
      dstryEvent(loaderID);
      // console.log(ajaxProcess[loaderID]);
    },
    error: function(requestObject, error, errorThrown) {
      console.error("AJX ERROR: "+error);
      console.error("AJX ERROR THROWN: "+errorThrown);
      if (err != undefined) {
        swal({icon: "error",title: "Unexpected error",text: "AJX+SERVER: "+err});
      } else {
        console.error(requestObject);
      }
      if (errMethod != undefined) errMethod();
      if (timeOut != undefined && error == 'timeout') timeOut();
    },
    timeout: timer // 10 seconds timeOut
  });
}
// ---------------------------------------------------------------------------->

// Generate discovered user network profile field ----------------------------->
function generate_net_prof(arr) {
  console.log("[+] Generate network profile");
  console.log(arr);

  let parent = document.querySelector("div[data-element-id='netlist']");
  clearDOM(parent);

  let nud = document.createElement('DIV');
      nud.setAttribute('class', 'net_usr_div');
      let nudp = document.createElement('DIV');
          nudp.setAttribute('class', 'nud_prof')
      nud.append(nudp);
      let nudi = document.createElement('class', 'nud_info');
          let nudin = document.createElement('class', 'nudi_name');
              nudin.innerText = arr.userName;
          nudi.append(nudin);
          let nudij = document.createElement('class', 'nudi_joint');
              nudij.innerText = arr.joints[0].jid;
          nudi.append(nudij);
      nud.append(nudi);
        parent.append(nud);
}
// ---------------------------------------------------------------------------->


// <!-- <div class="net_usr_div"> -->
//   <!-- <div class="nud_prof"></div> -->
//   <!-- <div class="nud_info"> -->
//     <!-- <div class="nudi_name">Stephen</div> -->
//     <!-- <div class="nudi_joint">8XJC6N</div> -->
//   <!-- </div> -->
// <!-- </div> -->
// https://github.com/joevennix/lan-js
