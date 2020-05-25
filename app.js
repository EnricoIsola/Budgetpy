class Utility {
    static fNumber (n, v) {
       var s = (v === true) ? '+' : '-';
       return s +  parseFloat(n).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    static fSignedNumber(incSum, expSum){
        var diff = incSum - expSum;
        if(diff > 0){
            return '+' + parseFloat(diff).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }else{
            return parseFloat(diff).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
    }

    static calcola(){
        var incSum =0; 
        var expSum =0;
        //
        document.querySelectorAll('.inc').forEach(function(current) {
            incSum += parseFloat(current.getAttribute('value')); 
        });
        View.incomeLabels.textContent = this.fNumber(incSum,true);

        document.querySelectorAll('.exp').forEach(function(current) {
            expSum += parseFloat(current.getAttribute('value')); 
        });
        View.expensesLabels.textContent = this.fNumber(expSum,false);

        //Calcola la percentuale fra totale inc e totale exp
        if (incSum > 0){
            var totPerc = (expSum / incSum)*100;
            View.percentageLabels.textContent =  totPerc.toFixed(0) + '%';
        }else{
            View.percentageLabels.textContent =  '---';
        }

        //Calcola totale generale
        View.budgetLabels.textContent = this.fSignedNumber(incSum, expSum);

        //Calcola le singole percentuali delle exp
        document.querySelectorAll('.item__percentage').forEach(function(current) {
            if(incSum > 0){
               current.textContent = ((parseFloat(current.getAttribute('percVal')) / incSum)*100).toFixed(0) + '%' 
            }else{
                current.textContent ='---';
            }
        });
    }
    
}

    var View = {
        inputType : eval('document.querySelector(\'.add__type\')'),
        inputDescription : eval('document.querySelector(\'.add__description\')'),
        inputValue : eval('document.querySelector(\'.add__value\')'),
        inputBtn : eval('document.querySelector(\'.add__btn\')'),
        incomeContainers : eval('document.querySelector(\'.income__list\')'),
        expensesContainers : eval('document.querySelector(\'.expenses__list\')'),
        budgetLabels : eval('document.querySelector(\'.budget__value\')'),
        incomeLabels : eval('document.querySelector(\'.budget__income--value\')'),
        expensesLabels : eval('document.querySelector(\'.budget__expenses--value\')'),
        percentageLabels : eval('document.querySelector(\'.budget__expenses--percentage\')'),
        containers : eval('document.querySelector(\'.container\')'),
        expensesPercLabels : eval('document.querySelector(\'.item__percentage\')'),
        dateLabels : eval('document.querySelector(\'.budget__title--month\')')
    }

class incItem {
    constructor(obj){
         this.id = obj.id;
         this.descr = obj.descr;
         this.value = obj.value;
    }

    item(){
         return `
        <div class='item inc clearfix' id='${this.id}' value='${this.value}'>
            <div class='item__description'>${this.descr}</div>
            <div class='right clearfix'>
                <div class='item__value'>${Utility.fNumber(this.value,true)}</div>
                <div class='item__delete'>
                    <button class='item__delete--btn' id='${'b' + this.id}'>
                        <i class='ion-ios-close-outline'></i>
                    </button>
                </div>
            </div>
        </div>
         `;
    }
}

class expItem {
    constructor(obj){
         this.id = obj.id;
         this.descr = obj.descr;
         this.value = obj.value;
    }

    item(){
         return `
        <div class='item exp clearfix' id='${this.id}' value=${this.value}>
            <div class='item__description'>${this.descr}</div>
            <div class='right clearfix'>
                <div class='item__value'>${Utility.fNumber(this.value,false)}</div>
                <div class='item__percentage' percVal=${this.value}></div>
                <div class='item__delete'>
                <button class='item__delete--btn' id='${'b' + this.id}'>
                        <i class='ion-ios-close-outline'></i>
                    </button>
                </div>
            </div>
        </div>
         `;
    }
}

class Budgetpy {
  
    static getCount() {
      return this.count += 1;
    }

    changedType(){
       View.inputType.classList.toggle('red-focus');
       View.inputDescription.classList.toggle('red-focus');
       View.inputValue.classList.toggle('red-focus');
       View.inputBtn.classList.toggle('red');

    }

    inputItem(){
         if(View.inputDescription.value !== '' && !isNaN(View.inputValue.value) && View.inputValue.value >0){
             if(View.inputType.value == 'inc'){
                  //
                    var ct = Budgetpy.getCount();
                    var newItem = new incItem({id:ct, descr:View.inputDescription.value, value:View.inputValue.value});
                    var html = newItem.item();
                    const div = document.createElement('div');
                    div.innerHTML = html;
                    View.incomeContainers.appendChild(div);
             }else{
                  //
                    var ct = Budgetpy.getCount();
                    var newItem = new expItem({id:ct, descr:View.inputDescription.value, value:View.inputValue.value});
                    var html = newItem.item();
                    const div = document.createElement('div');
                    div.innerHTML = html;
                    View.expensesContainers.appendChild(div);
             }
            Utility.calcola();
            //Add event listener to delete the item
            document.getElementById('b'+ ct).addEventListener('click',function(){
                document.getElementById(ct).remove();
                Utility.calcola();
            }); 
            //Reset input fields
            View.inputDescription.value ='';
            View.inputValue.value ='';
            
        }
    }

    init(){
    //Insert month and year
        const d = new Date();
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(d);
        View.dateLabels.textContent = `${mo} ${ye}`;
        //Reset fields
        View.inputType.addEventListener('change',this.changedType);
        View.inputBtn.addEventListener('click',this.inputItem);
        
}
}

var budget = new Budgetpy();
Budgetpy.count = 0;
budget.init();

