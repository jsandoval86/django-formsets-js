opt = {
  prefix: 'form',
  delete_class_btn: 'delForm'
}

function Formset (query_selector, options) {
  this.obj = query_selector
  this.options = options || opt
  this.total_forms = document.querySelector('#id_' + this.options.prefix + '-TOTAL_FORMS')
  var self = this

  this.create = function () {

    // create the formset in DOM
    var form = self.obj
    const parent_form = form.parentNode

    /** append button as 'Add form' **/
    var add_btn = document.createElement('a')
    add_btn.innerHTML = 'Add new'
    add_btn.setAttribute('href', '#')
    add_btn.setAttribute('class', 'class')
    parent_form.appendChild(add_btn)

    /** append delete button **/
    // get elements from parent-main content
    parent_content_children = parent_form.children
    // insert delete button into each element
    for (var i = 0; i < parent_content_children.length - 1; i++) {

      // create button delete form 
      delete_btn = document.createElement('a')
      delete_btn.innerHTML = 'Delete'
      delete_btn.setAttribute('href', '#')
      delete_btn.setAttribute('class', self.options.delete_class_btn)

      // content of delete button
      var delete_content
      delete_content = delete_btn

      // if content main is TBODY wrap button in TD element
      if (parent_form.tagName == 'TBODY') {
        td = document.createElement('td')
        td.appendChild(delete_btn)
        delete_content = td
      }

      let element = parent_content_children[i]
      // insert delete content in form
      element.appendChild(delete_content)
    }

    /** append new form to formset **/
    add_btn.addEventListener('click', function () {
      // template 
      var template = form.cloneNode(true)
      // insert new form
      parent_form.insertBefore(template, this)
      // select all data inputs into template
      data_fields = template.querySelectorAll('select,input,textarea,label')
      // get form tag number
      var form_tag_number = parseInt(self.total_forms.value)
      // increment TOTAL_FORMS
      self.total_forms.value = parseInt(self.total_forms.value) + 1

      for (var i = 0; i < data_fields.length; i++) {
        // update data [id,name]
        update_Element(data_fields[i], self.options.prefix, form_tag_number)
      }
    })

    /** delete form event**/
    parent_form.addEventListener('click', function (e) {
      // get element clicked
      var element_clicked = e.target
      // if className is equal to class delete button
      if (element_clicked.className == self.options.delete_class_btn) {
        // get form
        let form_to_delete = element_clicked.parentNode
        // get form if is tbody the content main
        if (parent_form.tagName == 'TBODY')
          form_to_delete = element_clicked.parentNode.parentNode

        form_to_delete.remove()
        // decrement TOTAL_FORMS
        self.total_forms.value = parseInt(self.total_forms.value) - 1

        // update tag number of the forms
        let parent_content_children = parent_form.children
        for (var i = 0; i < parent_content_children.length - 1; i++) {
          let form = parent_content_children[i]
          let data_fields = form.querySelectorAll('select,input,textarea,label')
          for (var j = 0; j < data_fields.length; j++)
            update_Element(data_fields[j], self.options.prefix, i)
        }
      }

      e.stopPropagation()
    })
  }

  /* update fields form */
  function update_Element (element, prefix, form_tag_number) {
    var regex = new RegExp(prefix + '-(\\d+|__prefix__)-')
    var replacement = prefix + '-' + form_tag_number + '-'

    // verify attribute and update
    if (element.getAttribute('for'))
      element.setAttribute('for', element.getAttribute('for').replace(regex, replacement))

    if (element.getAttribute('id'))
      element.setAttribute('id', element.getAttribute('id').replace(regex, replacement))

    if (element.getAttribute('name'))
      element.setAttribute('name', element.getAttribute('name').replace(regex, replacement))
  }
}
