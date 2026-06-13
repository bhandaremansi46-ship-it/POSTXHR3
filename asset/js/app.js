const cl = console.log;
const cardcontainer = document.getElementById('cardcontainer')
const inputform = document.getElementById('inputform')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userId = document.getElementById('userId')
const addpost = document.getElementById('addpost')
const updatepost = document.getElementById('updatepost')
const spinner = document.getElementById('spinner')

let postArr =[]

let Base_url ='https://jsonplaceholder.typicode.com'



function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

function fetchproducts (){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()

    let Post_Url = `${Base_url}/posts`

    xhr.open('GET',Post_Url)

    xhr.send(null)

    xhr.onload = function(){
        postArr = JSON.parse(xhr.response)
        
        createposts(postArr.reverse())
        
    }

}

fetchproducts()



function createposts(arr){
    let result = ''
    arr.forEach(ele =>{
        result +=`<div class="col-md-3 my-4" id =${ele.id}>
					<div class="card h-100">
						<div class="card-header">
							<h2>${ele.title}</h2>
						</div>
						<div class="card-body">
							<p>${ele.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-primary btn-sm " id="editbtn" onclick='onedit(this)'>Edit</button>
							<button class="btn btn-danger btn-sm " id="deletebtn" onclick='onremove(this)' >Remove</button>

						</div>
					</div>
				</div>`
    })


    cardcontainer.innerHTML =result


    spinner.classList.add('d-none')
}

function onsubmit(ele){
    spinner.classList.remove('d-none')
    
    ele.preventDefault()

    let newobj = {
        title : title.value,
        body : body.value,
        userId : userId.value,
    }

    let Post_url = `${Base_url}/posts`

    let xhr = new XMLHttpRequest()

    xhr.open('POST',Post_url)

    xhr.send(JSON.stringify(newobj))

    xhr.onload = function(){
       if(xhr.status >=200 && xhr.status <=299){
         let response =JSON.parse( xhr.response)

        addnewcard(newobj,response)
       }


    }




}


function addnewcard(newobj,response){
    let div = document.createElement('div')
    div.className = 'col-md-3 my-4'
    div.id = response.id


    div.innerHTML = `<div class="card h-100">
						<div class="card-header">
							<h2>${newobj.title}</h2>
						</div>
						<div class="card-body">
							<p>${newobj.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-primary btn-sm " id="editbtn" onclick='onedit(this)'>Edit</button>
							<button class="btn btn-danger btn-sm " id="deletebtn" onclick='onremove(this)' >Remove</button>

						</div>
					</div>`


    cardcontainer.prepend(div)


    inputform.reset()
    spinner.classList.add('d-none')


    snackbar(`The New Post id ${response.id} is added successfull!!`,'success')


}


function onedit(ele){
    spinner.classList.remove('d-none')
    
    let editId = ele.closest('.col-md-3').id
    localStorage.setItem('EditId',editId)
    let Post_url = `${Base_url}/posts/${editId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',Post_url)

    xhr.send(null)

    xhr.onload = function(){
       if(xhr.status >=200 && xhr.status <=299){
        let EditObj = JSON.parse(xhr.response)

        title.value = EditObj.title
        body.value = EditObj.body
        userId.value = EditObj.userId


        addpost.classList.add('d-none')
        updatepost.classList.remove('d-none')

       }else{

        let err = xhr.response

        snackbar(err,'error')

       }


    }

    spinner.classList.add('d-none')
    

}


function onupdate(){
    let updateId = localStorage.getItem('EditId')
    spinner.classList.remove('d-none')

    let updateObj ={
        title : title.value,
        body : body.value,
        userId : userId.value,
        id : userId
    }

    let PUT_url = `${Base_url}/posts/${updateId}`
    let xhr = new XMLHttpRequest()

    xhr.open('PUT',PUT_url)

    xhr.send(updateObj)

    xhr.onload = function(){
       if(xhr.status >= 200 && xhr.status <= 299){
         
        let div = document.getElementById(updateId)

        let h2 = div.querySelector('.card-header h2')

        h2.innerText = updateObj.title

        let p = div.querySelector('.card-body p')

        p.innerText = updateObj.body

        snackbar(`The Post id${updateId} is Updated successfully!!`,'success')

        addpost.classList.remove('d-none')
        updatepost.classList.add('d-none')
       }else{
        let err = xhr.response

        snackbar(err,'error')
       }
    }
    spinner.classList.add('d-none')
    
}


function onremove(ele){
    let removeId = ele.closest('.col-md-3').id
    spinner.classList.remove('d-none')

    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    
    let Remove_url = `${Base_url}/posts/${removeId}`

    let xhr = new XMLHttpRequest()

    xhr.open('DELETE',Remove_url)

    xhr.send(null)

    xhr.onload = function(){

        ele.closest('.col-md-3').remove();

        snackbar(`The card id ${removeId} is removed Successfully!!!`,'success')

    }


    spinner.classList.add('d-none')
    
  }
});

}







inputform.addEventListener('submit',onsubmit)
updatepost.addEventListener('click',onupdate)