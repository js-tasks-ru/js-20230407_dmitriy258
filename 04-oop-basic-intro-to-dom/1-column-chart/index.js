export default class ColumnChart {
    chartHeight = 50;
    child = {};
    
    constructor({label = '',
    value = 0,
    link = '',
    data = [],
    formatHeading = data => data
    } = {}) {
      this.label = label;
      this.value = formatHeading(value);
      this.link = link;
      this.data = data;
  
      this.render();
    }
  
    update(newData = []) {
      if (!newData) {
        this.element.classList.add("column-chart_loading");
      }
      this.data = newData;
      this.child.body.innerHTML = this.getDomBody();
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
                  ${this.getDomBody()}
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
    getDomBody() {
      const maxValue = Math.max(...this.data);
      const scale = this.chartHeight / maxValue;
    
      return this.data.map(item => {
        const percent = (item / maxValue * 100).toFixed(0);
        return `<div style="--value: ${Math.floor(item*scale)}" data-tooltip="${percent}%">
        </div>`;
      }).join("");
    }
  }
  
  
  