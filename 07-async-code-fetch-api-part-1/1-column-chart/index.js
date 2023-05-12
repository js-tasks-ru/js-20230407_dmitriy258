import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    chartHeight = 50;
    child = {};
    element;
    
    constructor({label = '',
    value = 0,
    link = '',
    data = [],
    formatHeading = data => data,
    url = '',
    range = {
        from : new Date(),
        to : new Date(),
    }
    } = {}) {
      this.label = label;
      this.formatHeading = formatHeading;
      this.value = formatHeading(value);
      this.link = link;
      this.data = data;
      this.url = new URL(url, BACKEND_URL); 
      this.range = range; 
      this.render();
      this.update(this.range.from, this.range.to);
    }
  
    async update(from , to) {
      
        this.element.classList.add("column-chart_loading");
      
     const data = await this.loadData(from, to);
      
     this.setNewRange(from, to);

     if (data && Object.values(data).length) {
        this.child.header.textContent = this.getHeadValue(data);
        this.child.body.innerHTML = this.getDomBody(data);
        this.element.classList.remove("column-chart_loading");
     }
     this.data = data;
      console.log( this.child.body.innerHTML)
     return this.data;
    }


    getHeadValue(data) {
      console.log(this.formatHeading(Object.values(data).reduce((a, b) => a + b , 0)));
      return this.formatHeading(Object.values(data).reduce((a, b) => a + b , 0))
    }


    async loadData(from , to) {
        this.url.searchParams.set('from', from.toISOString());
        this.url.searchParams.set('to', to.toISOString());

        return await fetchJson(this.url)
    }
  
    setNewRange(from, to) {
        this.range.from = from;
        this.range.to = to;
    }

    destroy(){
      this.remove();
     this.element = {};
     this.child = {};
    }
  
    remove() {
      if(this.element) {
        this.element.remove();
      }
  
    }
  
    createDomElem() {
      return `<div class="column-chart column-chart_loading" style="--chart-height: ${ColumnChart.chartHeight}">
                <div class="column-chart__title">
                  Total ${this.label}
                  ${this.getLink()}
                </div>
                <div class="column-chart__container">
                  <div data-element="header" class="column-chart__header">${this.value}</div>
                  <div data-element="body" class="column-chart__chart">
                  ${this.getDomBody(this.data)}
                  </div>
                </div>
              </div>`    
    }
  
  
    render() {
      const parentDiv = document.createElement('div');
  
      parentDiv.innerHTML = this.createDomElem();
  
      this.element = parentDiv.firstElementChild;
  
      if(this.data.length) {
  
        this.element.classList.remove("column-chart_loading");
      }
  
      this.child = this.getChild()
  
    }
  
   getLink() {
    return this.link 
    ? `<a class="column-chart__link" href="${this.link}">View all</a>`
    : "";
  }
  
   getChild(){
    const res = {};
    const elements = this.element.querySelectorAll("[data-element]");
  
    for (const child of elements) {
      const name = child.dataset.element;
      res[name] = child;
    }
    return res
   }
    getDomBody(data) {
      const maxValue = Math.max(...Object.values(data));
      const scale = this.chartHeight / maxValue;
    
      return Object.values(data).map(value => {
        const percent = (value / maxValue * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(value*scale)}" data-tooltip="${percent}%">
        </div>`;
      }).join("");
    }
  }
  
  
  
