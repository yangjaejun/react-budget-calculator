import React, { useState } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';

const App = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, charge: '렌트비', amount: 1600 },
    { id: 2, charge: '식비', amount: 400 },
    { id: 3, charge: '회식', amount: 1200 },
  ]);

  const [charge, setCharge] = useState('');
  const [amount, setAmount] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: '', text: '' });

  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(''); // 수정할 항목의 id를 저장할 state

  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  const handleAmount = (e) => {
    let amount = e.target.valueAsNumber;
    setAmount(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== '' && amount > 0) {
      if (edit) {
        const newExpense = expenses.map((expense) => {
          return expense.id === id ? { ...expense, amount, charge } : expense;
        });
        setExpenses(newExpense);
        setEdit(false);
        handleAlert({ type: 'success', text: '항목이 수정되었습니다.' });
      } else {
        const newExpense = { id: crypto.randomUUID(), charge, amount };
        setExpenses([...expenses, newExpense]); // 불변성을 지키기 위해 기존 expenses 배열을 복사한 뒤 새로운 expense를 추가
        setCharge('');
        setAmount(0);
        handleAlert({ type: 'success', text: '항목이 추가되었습니다.' });
      }
    } else {
      handleAlert({
        type: 'danger',
        text: '지출 항목을 입력하고 비용을 0보다 큰 수로 입력하세요.',
      });
    }
  };

  const handleDelete = (id) => {
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(newExpenses);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false }); // 3초 후에 alert를 사라지게 함
    }, 3000);
  };

  const handleEdit = (id) => {
    const expense = expenses.find((expense) => expense.id === id);
    const { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: 'success', text: '모든 항목이 삭제되었습니다.' });
  };

  return (
    <main className='main-container'>
      {alert.show ? (
        <Alert
          type={alert.type}
          text={alert.text}
        />
      ) : null}
      <h1>예산 계산기</h1>

      <div style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}>
        {/* Expense Form*/}
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
      </div>

      <div style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}>
        {/* Expense List*/}
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '1rem' }}>
        <p style={{ fontSize: '2rem' }}>
          총 지출 :
          <span>
            &nbsp;
            {expenses.reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0)}
            원
          </span>
        </p>
      </div>
    </main>
  );
};

export default App;
