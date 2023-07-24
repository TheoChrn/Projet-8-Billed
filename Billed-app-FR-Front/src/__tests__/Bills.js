/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import { ROUTES } from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import BillsContainer from "../containers/Bills.js"

import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1) 
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then new bill button should redirect me to the right page", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})
      const newBillsContainer = new BillsContainer({document, onNavigate, store: mockStore,  localStorage: window.localStorage})
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(() => newBillsContainer.handleClickNewBill())
      buttonNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(buttonNewBill, handleClickNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(onNavigate(ROUTES_PATH.pathname)).toBe(onNavigate(ROUTES_PATH.newBill))
    })
    test("Then it should show a modal when I click on the eye", () => {
      $.fn.modal = jest.fn()
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})
      const newBillsContainer = new BillsContainer({document, onNavigate, store: mockStore,  localStorage: window.localStorage})
      const iconEye = screen.getAllByTestId('icon-eye')[0]
      const handleClickIconEye = jest.fn(() => newBillsContainer.handleClickIconEye(iconEye))
      iconEye.addEventListener('click', handleClickIconEye)
      userEvent.click(iconEye, handleClickIconEye)

      expect(handleClickIconEye).toHaveBeenCalled()

    })
    describe("When i navigate to Dashbord", () => {
      test("fetches bills list from mock API GET", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@test.tld" }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
 
        const mockedBills = mockStore.bills()
        const spyGetList = jest.spyOn(mockedBills, "list")
        const bills = await mockedBills.list()
        const text = await screen.getByText("Mes notes de frais")
        expect(text).toBeTruthy()
        expect(spyGetList).toHaveBeenCalledTimes(1)
        expect(bills.length).toBe(4)
      })
      test("fetches bills create from mock API GET", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@test.tld" }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)

        const fakeBill = {
          id: 5,
          status: "pending",
          type: "Hôtel et logements",
          file: "fakeBill.jpg",
          date: "2005-05-05",
          amount: 500,
          email: "a@a"
        }
 
        const mockedBills = mockStore.bills()
        const spyGetCreate = jest.spyOn(mockedBills, "create")
        const bill = await mockedBills.create(fakeBill)
        const text = await screen.getByText("Mes notes de frais")
        expect(text).toBeTruthy()
        expect(spyGetCreate).toHaveBeenCalledTimes(1)
        expect(bill.key).toBe("1234")
        expect(spyGetCreate).toHaveBeenCalledWith(fakeBill)
      })
      test("fetches bills create from mock API GET", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@test.tld" }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)

        const fakeBill = {
          id: 5,
          status: "pending",
          type: "Hôtel et logements",
          file: "fakeBill.jpg",
          date: "2005-05-05",
          amount: 500,
          email: "a@a"
        }
 
        const mockedBills = mockStore.bills()
        const spyGetUpdate = jest.spyOn(mockedBills, "update")
        const bill = await mockedBills.update(fakeBill)
        const text = await screen.getByText("Mes notes de frais")
        expect(text).toBeTruthy()
        expect(spyGetUpdate).toHaveBeenCalledTimes(1)
        expect(spyGetUpdate).toHaveBeenCalledWith(fakeBill)
        expect(bill.id).toBe("47qAXb6fIm2zOKkLzMro")
      })
    })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
        jest.spyOn(mockStore, "bills")
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
        const html = BillsUI({error: "Erreur 404"})
        document.body.innerHTML = html
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})

        window.onNavigate(ROUTES_PATH.Bills)
        const text = await screen.getByText(/Erreur 404/)
        expect(text).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
        const html = BillsUI({error: "Erreur 500"})
        document.body.innerHTML = html
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})

        window.onNavigate(ROUTES_PATH.Bills)
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})