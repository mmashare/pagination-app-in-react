import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
} from "mdb-react-ui-kit";
import styles from "./App.module.css";

function App() {
  const [Data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [sortValue, setSortvalue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [DataLimitPerPage] = useState(4);
  const [operation, setOperation] = useState("");
  const [sortFilterValue, setSortFilterValue] = useState("");

  const sortOption = ["name", "address", "email", "phone", "status"];
  // ye select html tag ke ander kam ayega ham issske element ko map karege <option>{"name"}</option>,<option>{"address"}</option>,<option>{"email"}</option>,<option>{"phone"</option> like that .

  useEffect(() => {
    // ye home apge ke liye hai issliye 0 index data to 4 index data with 0 increase(currentPage(0)+0=0)
    loadData(0, 4, 0, operation, sortFilterValue);
  }, []);

  // loadData is most main func because issme ham sab type like filter,sort,search,default type ke api get kar rahe hai.
  const loadData = async (
    start,
    end,
    increase,
    optType = null,
    FilterOrSearch
  ) => {
    // star => means from which index you want to print data
    // end => to which index you want to print data
    // optType => means app konsa method use kar rahe ho like sort,filter,search,or simple
    // FilterOrSearch => basically ye only as a var store ki tarah kam ayega because hamme kafi time ek particular func se kuch data grag karke iss switch case ke ander
    // use karna hota hai maximum time ham isse kam hi use karte hai
    switch (optType) {
      // basically sare case ka logic same hota hai bss url toda different hota hai jisspar ham get api bej rahe hai.
      case "search":
        // always know app har method me inn state ko fill kare with some data, situation and method ke hisab se use kare inne bss
        setOperation(optType);
        setSortFilterValue("");
        return await axios
          .get(
            `http://localhost:5000/users?q=${value}&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => {
            console.log(err);
          });
      case "sort":
        setOperation(optType);
        setSortFilterValue(FilterOrSearch);
        return await axios
          .get(
            `http://localhost:5000/users?_sort=${FilterOrSearch}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => {
            console.log(err);
          });
      case "filter":
        setOperation(optType);
        setSortFilterValue(FilterOrSearch);

        return await axios
          .get(
            `http://localhost:5000/users?status=${FilterOrSearch}&_order=asc&_start=${start}&_end=${end}`
          )
          .then((response) => {
            setData(response.data);
            setCurrentPage(currentPage + increase);
          })
          .catch((err) => {
            console.log(err);
          });

      default:
        // ye deafult hamme home screen par dikega but with pagination ,is ka logic easy hai .
        return (
          setLoading(true),
          await axios
            .get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
            .then(
              (response) => (
                setData(response.data), setCurrentPage(currentPage + increase)
              )
            ),
          setLoading(false)
        );
    }
  };

  console.log(Data);

  // search input data load( search button)
  const handleSearch = async (e) => {
    e.preventDefault();
    loadData(0, 4, 0, "search", sortFilterValue);
  };

  // (reset button)
  const handleReset = () => {
    // operation me hammne func ko argument ki help se ye bataya hai ki method konsa hai like search,sort,ordeafult
    setOperation("");
    // value me hamra search input me likhe word hai
    setValue("");
    // sort filter me jo filter like name,email select kiye hai vo hai
    setSortFilterValue("");
    setCurrentPage(0);

    // basically yaha operation and sortFilterValue alrady null hai. becasue of initial steps
    loadData(0, 4, 0, operation, sortFilterValue);
  };

  // sorting data by button

  const handleSort = async (e) => {
    // yaha ham (start,end,increase,method,value that ye select in option tag like name or price or address etc)
    loadData(0, 4, 0, "sort", e.target.value);
  };

  // filter data by active and Inactive status
  const handleFilter = async (val) => {
    //(start,end,increase,method,value that ye select the button type like active or inactive)
    loadData(0, 4, 0, "filter", val);
  };

  // this func create pagination panel
  const renderPagination = () => {
    if (Data.length < 4 && currentPage === 0) return null;
    // currentpage => increase that u give in argument && har step par ye increase jo app de rahe ho vo add hota rahega previous currentpage ki value me
    // for example (step 1-> loaddata(0,4,0) means apne increase 0 diya hai too currentpage ki value bhi zero(0) hogi) (step 2 -> loaddata(4,8,1) yaha apne increase 1 diya hai means previous currentpage value(0) + new increase(1) = 0+1=1; means apki currentPage ab 1 ho gyi hai ye iss hisab se work karta hai)
    if (currentPage === 0) {
      // yaha hamne currentPage ki 0th value ke liye specialy logic likha hai because app nhi chahige ki apki firstPage(home screen page) par PrevButton bhi dikhe(only nextButton dikna chiye)
      // that's why hamne yaha loadData(4, 8, 1) hardode karke step likhe hai, always know ki ye loadData(4, 8, 1) homescreen ke liye nhi hai ye jab work karga jab app 0 currentPage par ho
      // and apne nextButton dabaya hai.and kyoki abb apne NextButton daba diya hai so now abb ye logic yaha ban ho jayega. and else if (logic) suru ho jayega because now currentPage value (0+1=1) ho gaye hai and ye logic only
      // curentPage = 0 ke liye tha, if currentPage value is(1)or(2) it's means vaha else if logic lagega
      return (
        <div className={styles.paginationSection}>
          <p className={styles.NumberOfPage}>1</p>

          <button
            onClick={() => {
              // yaha hammne hardcode karke issme likha hai because ye hamara first Next button logic hai isske badd else if(logic) ka next button work karega ye nhi
              loadData(4, 8, 1, operation, sortFilterValue);
            }}
          >
            Next
          </button>
        </div>
      );
    } else if (
      // don't worry ye logic currentPage ki 0th value par work nhi karege (vase to ye usspar bhi work karta) because currentPage===0 ke liye hamne pahle hi logic lik diya hai.
      // ye logic currentPage value =(1)or(2) par work karega.
      // yaha hamne bola hai ki ager currentpage(?) ki value DataLimitPerPage(4-1=3) value se kam hai(manlo ager kabi currentPage me 3 value ho jati hai tab ye buton nhi dikege)
      // &&(and) data state ke ander jo data hai(ye ata var me hamne api ka sra data store kiya hai)
      // usski length DataLimitPerPage se match hoti hai  tab tek ye dono button dekge ek sat.
      currentPage < DataLimitPerPage - 1 &&
      Data.length === DataLimitPerPage
    ) {
      return (
        <div className={styles.paginationSection}>
          <button
            onClick={() => {
              // yaha hammne basically ye logic(0,4,0) diya hai hammne bola hai ki start=(currentpage(1)-1 = 0*4),end=(currentPage(1)*4,increase(1)-1)
              // ye logic apko dobara useEffect(loadData(0,4,0) vale page par le jayega)
              loadData(
                (currentPage - 1) * 4,
                currentPage * 4,
                -1,
                operation,
                sortFilterValue
              );
            }}
          >
            Prev
          </button>
          <p className={styles.NumberOfPage}>{currentPage + 1}</p>
          <button
            onClick={() => {
              // yaha basically hamne ye logic diya hai(8,12,2), start=(currentPage(1)+1=2*4),end=(currentPage(1)+2=3*4),increase=(oldIncrease(1)+2=3)
              // ye basically final next button hoga becasue isske increase currentPage ki value ko 3 bana deta hai.jo ki elseif(logic) ka end hai

              loadData(
                (currentPage + 1) * 4,
                (currentPage + 2) * 4,
                1,
                operation,
                sortFilterValue
              );
              // how next button and prev button work
              // 1 -> prev button (start=curretpage-1*4(isske start isske end se bhi ek step kam hoga),end=currrent*4(isska end next ke start se ek step kam hoga),increase = -1)
              //2 -> next button (start=prev(end+1)*4 ye prev ka twice,end=next(start+2)*4 ye apee(next) he start ka twice hai,increase = 1)
            }}
          >
            Next
          </button>
        </div>
      );
    } else {
      // ye logic jab work karega jab currentPage value = 3 ho jayegi means vo end page hai usse jayada deta ham par and abb because else if(logic ) work nhi karega
      // too usske prev and next button bhi nhi dekhege to abb hammne alag se ek prev button banana padega(jo hamme back lekar jayeee)
      // (8,12,-1) yaha ham same else if(logic) ke prev Button ke logic de rahe hai because else If(logic) abb nhi raha hai because hamri current page value 3 ho gyi hai
      // how prev buton code works -> bas hamme ye pata hona chiye ki currentpage var ki value iss time kitne hogi(oldcurrentPage+increase)
      // start=(currentpage(3)-1=2*4)=>8 , end=(currentPage(3)*4)=>12, increase=(currentPage(3)-1)=>2 {{{{basically ye next button and prev button ka code automation ki tarah work karega hammnjayada sochne ki jarurat nhi hai}}}}}
      // its means app iss button par click karte hi else if(logic)  par poch jaoge
      return (
        <div className={styles.paginationSection}>
          <button
            onClick={() =>
              loadData(
                (currentPage - 1) * 4,
                currentPage * 4,
                -1,
                operation,
                sortFilterValue
              )
            }
          >
            Prev
          </button>
          <p className={styles.NumberOfPage}>{currentPage + 1}</p>
        </div>
      );
    }
  };

  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "20px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className={styles.formOfinput}
        onSubmit={handleSearch}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => {
            return setValue(e.target.value);
          }}
          placeholder="search here"
          className={styles.searchinput}
        />
        <button
          onClick={handleSearch}
          type="submit"
          className={styles.searchBtn}
        >
          Search
        </button>
        <button onClick={handleReset} className={styles.resetBtn}>
          Reset
        </button>
      </form>

      <div className={styles.parent}>
        <h1 className={styles.heading}>My Data Filter App 2</h1>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Status</th>
                </tr>
              </MDBTableHead>
              {Data.length === 0 ? (
                <MDBTableBody>
                  <tr>
                    {loading ? (
                      <td className={styles.errorData}>Loading....</td>
                    ) : (
                      <tr>
                        <td colSpan={8} className={styles.noDataFound}>
                          No Data Found
                        </td>
                      </tr>
                    )}
                    <td colSpan={8}>{loading}</td>
                  </tr>
                </MDBTableBody>
              ) : (
                Data.map((item) => (
                  <MDBTableBody key={item.id}>
                    <tr>
                      <th scope="row">{item.id}</th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </div>

      {Data.length > 0 && (
        <MDBRow>
          {/* size means width of column */}
          <MDBCol size="8">
            <select
              style={{ width: "50%", borderRadius: "2px", height: "30px" }}
              onChange={handleSort}
              value={sortValue}
            >
              <option>Please Select A Value</option>
              {sortOption.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </MDBCol>
          <div>{renderPagination()}</div>
          <MDBCol>
            <h5>Filter By Status:</h5>
            <button
              style={{
                color: "green",
                marginRight: "5px",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onClick={() => {
                handleFilter("Active");
              }}
            >
              Active
            </button>
            <button
              style={{
                color: "red",
                marginRight: "5px",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
              onClick={() => {
                handleFilter("Notactive");
              }}
            >
              NotActive
            </button>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;
