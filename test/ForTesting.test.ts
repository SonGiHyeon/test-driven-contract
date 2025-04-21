import { expect } from 'chai';
import { ethers } from 'hardhat';

/*
  ForTesting 테스트 리스트 예시
  (아래의 테스트 외에 필요한 테스트를 구현해보시기 바랍니다.)

  - owner 관련
    - 배포시 owner 상태 변경 여부
    - setValue()를 owner만 할 수 있는지
    - withdraw()를 owner만 할 수 있는지
  
  - 함수 검증
    - setValue()를 실행 후 value를 바꾸는지
    - (getter) balances()를 실행 후 balance 값이 나오는지
    - deposit()를 실행 후 보낸 값(value)에 따라 balances를 바꾸는지
    - withdraw()를 실행 후 받을 값(amount)에 따라 balances를 바꾸는지
  
  - 이벤트 검증
    - setValue()를 실행 후 ValueChanged 이벤트가 발생하는지
    - deposit()를 실행 후 Deposited 이벤트가 발생하는지
    - withdraw()를 실행 후 Withdrawn 이벤트가 발생하는지
*/


// 방형키 누를 때마다 블록체인 트랜잭션 일으킴

describe('ForTesting 테스트', function () {
  let contract: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory('ForTesting');
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
  });

  describe('테스트 단위별로 나눌 수 있습니다.', function () {
    it('테스트 개체별로 나눌 수 있습니다.', function () {
      expect(true).to.be.true;
    });
  });

  describe('owner 관련', function () {
    it('배포시 owner 상태 변경 여부', async function () {
      expect(await contract.connect(owner))
    })
    it('setValue()를 owner만 할 수 있어야 합니다.', async function () {
      expect(await contract.connect(owner).setValue(1)).to.not.be.reverted;
    })
    it("withdraw()를 owner만 할 수 있어야 합니다.", async function () {
      const amount = ethers.parseEther("1");

      // 먼저 deposit을 수행해서 잔액을 채움
      expect(
        await contract.connect(owner).deposit({ value: amount })
      )

      // 그 후 withdraw 수행
      expect(
        await contract.connect(owner).withdraw(amount)
      )
    });

  });

  describe('함수 검증', function () {
    it('setValue()를 실행 후 value를 바꾸는지', async function () {
      expect(await contract.setValue(100));
    })
    it('(getter) balances()를 실행 후 balance 값이 나오는지', async function () {
      expect(await contract.balances(owner.address));
    })
    it('deposit()를 실행 후 보낸 값(value)에 따라 balances를 바꾸는지', async function () {
      const amount = ethers.parseEther("1");

      expect(await contract.deposit({ value: amount }))

      expect(await contract.balances)
    })
    it('withdraw()를 실행 후 받을 값(amount)에 따라 balances를 바꾸는지', async function () {
      const amount = ethers.parseEther("1");

      expect(await contract.deposit({ value: amount }))
      expect(await contract.withdraw(amount))
      expect(await contract.balances(owner.address))
    })

    describe('이벤트 검증', function () {
      it('setValue()를 실행 후 ValueChanged 이벤트가 발생하는지', async function () {
        expect(await contract.setValue(42))
          .to.emit(contract, "ValueChanged")
      })
      it('deposit()를 실행 후 Deposited 이벤트가 발생하는지', async function () {
        const amount = ethers.parseEther("1");
        expect(await contract.deposit({ value: amount }))
          .to.emit(contract, "Deposited")
      })
      it('withdraw()를 실행 후 Withdrawn 이벤트가 발생하는지', async function () {
        const amount = ethers.parseEther("1");
        expect(await contract.deposit({ value: amount }))
        expect(await contract.withdraw(amount))
          .to.emit(contract, "Withdrawn")
      })
    }
    )

  })
})

// balances 함수가 mapping으로 되어 있는데 balance를 확인하려면 
// 1. contract.balances가 될 거 같고
// 2. contract.balances(owner.address)가 될 수 있을거 같은데
// contract.balances()는 매개변수가 없는데 왜 되는지? 자체적으로 contract.balances(address(0))이 기본값으로 되어있는건지
// await를 앞에 붙여주면 비동기로 오류 먼저 내보내서 테스트에 대한 오류를 확인할 수 있다
