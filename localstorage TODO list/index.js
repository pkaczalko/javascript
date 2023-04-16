//pobranie uchwytow
let div = document.getElementById('div');
let wynik = document.getElementById('wynikiWyszukiwania');
let input = document.getElementById('task');
let date = document.getElementById('date');
let btnDodaj = document.getElementById("addBtn");
let btncls = document.getElementById("clsBtn");
let szukajka = document.getElementById("search");
let btnUsun;
let zadania = [];

//sprawdzenie czy istnieje tablica w ls
if (localStorage.getItem("tasks") !== null) {

	zadania = JSON.parse(localStorage.getItem("tasks"));
}

//deklaracja klasy
const tudu = class
{	//skrypt zmieniajacy domyslny format daty
	data(str){
			let res = '';
		if(str.includes('-'))
		{
			let data = str.split('-');
			res = res + data[data.length-1];
			for(let i=data.length-2;i>=0;i--)
			{
				res = res +'.'+ data[i];
			}
		}else{	res = str; }
		return res;
	}

	//ladowanie skryptow przy kazdej zmianie struktury strony
	load(){
		this.wczytaj();
		this.usun();
		this.edytuj();
	}

	// oskryptowanie przycisku dodaj
	dodaj(val = "tasks")
	{

		btnDodaj.addEventListener('click',() =>
		{
		if(task.value.length>=3 && task.value.length<=255)
		{
			zadania.push({"zadanie":task.value,"data":this.data(date.value)});
			localStorage.setItem(val, JSON.stringify(zadania));
			alert(`Dodano zadanie ${task.value}!`);
			this.load();
		}else 
		{
			alert('Zadanie nie spelnia wymagan! (Co najmniej 3 znaki i nie wiecej niz 255 znakow)');	
		}
		});

	
	}
	//oskryptowanie przyciskow usun
	usun(val = "tasks")
	{
		btnUsun = document.getElementsByClassName('delete');
		let id= 0;
		let nazwaZadania = '';
		for(let i=0;i<btnUsun.length;i++)
		{
			btnUsun[i].addEventListener('click',()=>{
				id = Number(btnUsun[i].id);
				nazwaZadania = zadania[id]["zadanie"];
				zadania.splice(id,1);
				localStorage.setItem(val, JSON.stringify(zadania));
				alert(`Usunieto zadanie ${nazwaZadania} !`);
				this.load();


			});
		}
		
		
		

	}
	//wczytanie danych do tabeli
	wczytaj(dane = zadania)
	{	
		let tresc = `<table>
					<tr>
                  		<th>Zadanie</th>
                  		<th>Data</th>
                	</tr>`;
			
		for(let i=0;i<dane.length;i++)
		{	

			tresc = tresc + `
				  			<tr id=w${i}>
	              			   <td class="task_name">${dane[i]["zadanie"]}</td>
	              			   <td class="task_date">${dane[i]["data"]}</td>
	              			   <td><button type="submit" class="delete" id="${i}">Usun</button></td>
	              			</tr>
	              			`;
		}

		tresc = tresc + '</table>';
		div.innerHTML = tresc;

		
	
	}

	//skrypt wyszukiwania
	szukaj()
	{	let znalezione = []
		let zapytanie = "";
		let s;
		szukajka.addEventListener('focus', ()=> 
		{
			zapytanie = szukajka.value;
        
        	
	        szukajka.addEventListener('keyup', ()=> 
	        {	

	        	zapytanie = szukajka.value;
	            for(let i=0;i<zadania.length;i++)
	            {	if(zapytanie === ''){document.getElementById('w'+i).style.display = ''; }
	            	console.log(i,zapytanie)
	            	if((zadania[i]['zadanie'].includes(zapytanie) && zapytanie !== '')||(zadania[i]['data'].includes(zapytanie) && zapytanie !== '')){
	            		document.getElementById('w'+i).style.backgroundColor = 'yellow';
	            	}else{
	            		if(zapytanie !== ''){document.getElementById('w'+i).style.display = 'none'; }
	            		document.getElementById('w'+i).style.backgroundColor = '';
	            		
	            	}

	            }
	        });


    	});

		szukajka.addEventListener('blur', function() {

			for(let i=0;i<zadania.length;i++)
	            {
	            	document.getElementById('w'+i).style.display = '';
	            }

		});




	}


	//oskryptowanie przycisku wyczysc
	wyczysc(){
		btncls.addEventListener('click',()=>{
			zadania = zadania.splice(zadania.length, zadania.length);
			localStorage.clear();
			alert("wyczyszczono!")
			this.load();
		});
	}




	//skrypt edytowania listy
	edytuj(val="tasks"){
		let tr = document.getElementsByClassName('task_name');
		let td = document.getElementsByClassName('task_date');
		let edit="";
		for(let i=0;i<tr.length;i++){
			tr[i].addEventListener('click',()=>{
				edit = prompt("Edytuj zadanie",zadania[i]["zadanie"])
				if(edit===null){return;}
				if(edit.length>=3 && edit.length<=255)
				{
					tr[i].innerHTML = `<td class="task_name">${edit}</td>`;
					zadania[i]['zadanie'] = edit;
					localStorage.setItem(val, JSON.stringify(zadania));
					this.load();
				}else
				{
					alert('Zadanie nie spelnia wymagan! (Co najmniej 3 znaki i nie wiecej niz 255 znakow)');
				}

			});

			td[i].addEventListener('click',()=>{
				edit = prompt("Edytuj date",zadania[i]["data"])
				if(edit===null){return;}
				td[i].innerHTML = `<td class="task_date">${edit}</td>`;
				zadania[i]['data'] = edit;
				localStorage.setItem(val, JSON.stringify(zadania));
				this.load();

			});

		}
	}


}





const lista = new tudu();
document.addEventListener("DOMContentLoaded",()=> 
{

	lista.load();
	lista.dodaj();
	lista.wyczysc();
	lista.szukaj();

});