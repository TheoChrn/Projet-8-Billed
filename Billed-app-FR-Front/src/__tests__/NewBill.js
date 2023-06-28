/**
 * @jest-environment jsdom
 */

 import { fireEvent, screen } from "@testing-library/dom"
 import userEvent from "@testing-library/user-event"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import mockStore from "../__mocks__/store"
 import { ROUTES } from "../constants/routes";
 
 describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page", () => {
     describe("When I change file", () => {
       test("Then it should change file if it has an extension : jpg, jpeg or png", () => {
         window.localStorage.setItem('user', JSON.stringify({
           email: 'employee@test.tld'
         }))
         const html = NewBillUI()
         document.body.innerHTML = html
         const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})
         const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
 
         const file = new File(["ballon"], "ballon.jpg", {
           type: 'image/jpg'
         }) 
         const input = screen.getByTestId('file')
         const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
         input.addEventListener('change', handleChangeFile)
         userEvent.upload(input, file)
 
 
         expect(handleChangeFile).toHaveBeenCalled()
         expect(file.type).toStrictEqual('image/jpg')
       })
       test("Then it should prevent inputting an extension different than : jpg, jpeg or png", () => {
        window.localStorage.setItem('user', JSON.stringify({
          email: 'employee@test.tld'
        }))
        const html = NewBillUI()
        document.body.innerHTML = html
        const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})
        const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})

        const file = new File(["ballon"], "ballon.pdf", {
          type: 'application/pdf'
        }) 
        
        const input = screen.getByTestId('file')
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        input.addEventListener('change', handleChangeFile)
        userEvent.upload(input, file)

        expect(handleChangeFile).toHaveBeenCalled()
       })
     }) 
   })
   describe("When I submit the form and it's valid", () => {
     test("Then it should create a bill object", () => {
       window.localStorage.setItem('user', JSON.stringify({
         email: 'employee@test.tld'
       }))
       const html = NewBillUI()
       document.body.innerHTML = html
       const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})
       const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
       
       const form = screen.getByTestId('form-new-bill')
       const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
       form.addEventListener('submit', handleSubmit)
       fireEvent.submit(form)
       expect(handleSubmit).toHaveBeenCalled()
       expect(screen.getByText(/mes notes de frais/i)).toBeTruthy()
     })
   })
 })
 
 
 