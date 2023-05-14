import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_URL = 'https://api.imgur.com/3/upload';
const BACKEND_URL = 'https://course-js.javascript.ru';
const CATEGORY_URL = 'api/rest/categories?_sort=weight&_refs=subcategory';
const PRODUCT_URL = 'api/rest/products';

export default class ProductForm {
  element;
  subElements = {};
  defaultFormData = [{
    title : '',
    description : '',
    quantity : 1,
    subcategoriy : '',
    status: 1,
    images : [],
    price : 100,
    discount : 0
  }];

  onSubmit = event => {
    event.preventDefault();

    this.save();

  }

  uploadImage = () => {
    const fileInput = document.createElement('input');
    const url = new URL(IMGUR_URL);
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();
    fileInput.onchange = async () => {
      const [file] = fileInput.files;

      if (file) {
        const formData = new FormData();
        const { sortableImageList } = this.subElements;

        formData.append('image',file);
        formData.append('name','file');
        try {
          const response = await fetch(url, {
            method : 'POST',
            headers: {
              'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
            },
            body : {
              'formData': formData
          }});

          let result = await response.json();
          console.log(result);
          this.data.productData[0].images.push({
            url: `${result.data.link}`,
            sourse: `${result.data.id}`
          });
          sortableImageList.innerHTML = this.getImage(this.data);

        } catch (error) {
          console.error('Error: ',error);
        }
      }
    }

  }

  constructor (productId) {
    this.productId = productId;
    this.urlCategory = new URL(CATEGORY_URL,BACKEND_URL);
    this.urlProduct = new URL(PRODUCT_URL,BACKEND_URL);

    if (this.productId) {
      this.urlProduct.searchParams.set('id',this.productId);
    }
  }

   async render() {
    
   
     const data = await this.loadData(this.productId);

      this.data = data;
      console.log(this.data);
      this.show();
    
    }

    show() {
      const wrapper = document.createElement('div');
     wrapper.innerHTML = this.getTemplate(this.data);
     this.element = wrapper.firstElementChild;
      this.subElements = this.getSubElement(this.element);
     
      this.initEventListeners();
    }

    async loadData (productId) {
      const data = await this.load(productId);
  
      return data;
    }
  
    async load (productId) {
      let productData = {};
      let categoryData = {};

      if (productId) {
         productData = await fetchJson(this.urlProduct);
         categoryData = await fetchJson(this.urlCategory);
    
        return { productData : productData , categoryData : categoryData};

      }

       categoryData = await fetchJson(this.urlCategory);
      productData = this.defaultFormData;
      return  { productData : productData , categoryData : categoryData};
    }

    getCategoryOptions(data) {
      return data.map(item => { return  this.getSubcategories(item.subcategories,item.title) }).join('');
    }

    getSubcategories(categoryData,categoryId) {
      return categoryData.map(item => {
        return this.data.productData[0].subcategory === item.id ? `<option value='${item.id}' selected>${categoryId +' > '+item.title}</option>` : `<option value='${item.id}'>${categoryId +' > '+item.title}</option>` 
      }).join('');
    }
  
    getStatus(data) {
      if(data.productData[0].status === 1) {
        return `
        <option value='1' selected>Активен</option>
        <option value='0'>Не активен</option>`;
      }
      return `<option value='1'>Активен</option>
      <option value='0' selected>Не активен</option>`;
    }

    getImage(data) {
      console.log(data);
      return data.productData[0].images.map(item => {
        return `<li class="products-edit__imagelist-item sortable-list__item" style="">
      <input type="hidden" name="url" value="${item.url}">
      <input type="hidden" name="source" value="${item.source}">
      <span>
    <img src="icon-grab.svg" data-grab-handle="" alt="grab">
    <img class="sortable-table__cell-img" alt="Image" src="${item.url}">
    <span>${item.source}</span>
  </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
      </button></li>`}).join('')
    }

    initEventListeners() {
      const {productForm, uploadImage} = this.subElements;

      productForm.addEventListener('submit', this.onSubmit);
      uploadImage.addEventListener('click', this.uploadImage);
    }

    getSubElement(element) {
      const result = {};
      const elements = element.querySelectorAll('[data-element]');
    
      for (const subElem of elements) {
        const name = subElem.dataset.element;
    
        result[name] = subElem;
      }
      console.log(result);
      return result;
    }

  getTemplate(data) {
    console.log(data);
    const {productData, categoryData} = data; 
    
      return `<div class="product-form">
      <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value = '${this.data.productData[0].title}'>
          </fieldset>
        </div>
        <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.data.productData[0].description}</textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <div data-element="imageListContainer"><ul class="sortable-list" data-element="sortableImageList">${this.getImage(this.data)}</ul></div>
          <button type="button" name="uploadImage" data-element="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
          <select class="form-control" name="subcategory" data-element="category">
          ${this.getCategoryOptions(categoryData)}
          </select>
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required="" type="number" name="price" class="form-control" placeholder="100" value="${this.data.productData[0].price}">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.data.productData[0].discount}">
          </fieldset>
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.data.productData[0].quantity}">
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select class="form-control" name="status" data-element="statusElement">
            ${this.getStatus(data)}
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" data-element="productForm" name="save" class="button-primary-outline">
            Сохранить товар
          </button>
        </div>
      </form>
    </div>`;
  }


 

 

  remove() {
    if(this.element) {
     this.element.remove();
    }
 }

 destroy() {
   this.remove();
   this.element = {};
   this.subElements = {};
 }
}

