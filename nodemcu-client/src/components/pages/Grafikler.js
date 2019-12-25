import React, { Component } from "react";
import firebase from "../../firebase.js";

import LineChart from "../LineChart";

const grafikData = firebase.database();

export class Grafikler extends Component {
  state = {
    sicaklik: {
      deger: 0,
      durum: "DUSUK",
      background: "bg-success"
    },
    nem: {
      deger: 0,
      durum: "DUSUK",
      background: "bg-success"
    },
    gaz: {
      deger: 0,
      durum: "DUSUK",
      background: "bg-success"
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1 className="display-3">Sensör Grafikleri</h1>
        <div className="container ">
          <div className="border row justify-content-center mb-3">
            <div className="container">
              <h2 className="bg-primary text-white display-4">Sıcaklık</h2>
              <div className="row justify-content-center">
                <h5>Sıcaklık Grafiği</h5>
                <div className="container">
                  <LineChart name={"sicaklik"} />
                </div>
              </div>
              <div className="row justify-content-center">
                <h5>Sıcaklık Değeri</h5>
                <div className="container">
                  <span
                    className={
                      "col text-white lead " + this.state.sicaklik.background
                    }
                  >
                    {this.state.sicaklik.deger} °C
                  </span>
                  <span
                    className={
                      "col text-white lead ml-3 " +
                      this.state.sicaklik.background
                    }
                  >
                    {this.state.sicaklik.durum === "DUSUK" ? "Düşük" : "Yüksek"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-light border row justify-content-center mb-3">
            <div className="container">
              <h2 className="bg-primary text-white display-4">Nem</h2>
              <div className="row justify-content-center">
                <h5>Nem Grafiği</h5>
                <div className="container">
                  <LineChart name={"nem"} />
                </div>
              </div>
              <div className="row justify-content-center">
                <h5>Nem Değeri</h5>
                <div className="container">
                  <span
                    className={
                      "col text-white lead " + this.state.nem.background
                    }
                  >
                    % {this.state.nem.deger}
                  </span>
                  <span
                    className={
                      "col text-white lead ml-3 " + this.state.nem.background
                    }
                  >
                    {this.state.nem.durum === "DUSUK" ? "Düşük" : "Yüksek"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border row justify-content-center mb-3">
            <div className="container">
              <h2 className="bg-primary text-white display-4">Gaz</h2>
              <div className="row justify-content-center">
                <h5>Gaz Grafiği</h5>
                <div className="container">
                  <LineChart name={"gaz"} />
                </div>
              </div>
              <div className="row justify-content-center">
                <h5>Gaz Değeri</h5>
                <div className="container">
                  <span
                    className={
                      "col text-white lead " + this.state.gaz.background
                    }
                  >
                    {this.state.gaz.deger} ppm
                  </span>
                  <span
                    className={
                      "col text-white lead ml-3 " + this.state.gaz.background
                    }
                  >
                    {this.state.gaz.durum === "DUSUK" ? "Düşük" : "Yüksek"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  setGrafikDurum = (grafikUyesi, grafikDeger, grafikDurum) => {
    this.setState({
      [grafikUyesi]: {
        deger: grafikDeger,
        grafikDurum: grafikDurum
      }
    });
  };

  //setDegerBackground = stateDurum => {
  // return stateDurum === "DUSUK" ? "bg-warning" : "bg-danger";
  //};

  getLastGrafikData = grafikItemi => {
    let dataRef = grafikData.ref(grafikItemi);
    dataRef.on("value", snapshot => {
      let keyLenght = Object.keys(snapshot.val().deger).length - 1;
      let lastArrayItem = Object.keys(snapshot.val().deger)[keyLenght];
      let lastItemOfDeger = snapshot.val().deger[lastArrayItem];
      //console.log(grafikItemi + " " + lastItemOfDeger);

      let durumMessage = "DUSUK";
      let bgState = "bg-success";
      let limitDegerObj = {
        sicaklik: 30,
        gaz: 280,
        nem: 60
      };

      let limitDeger = limitDegerObj[grafikItemi];

      if (lastItemOfDeger <= limitDeger) {
        durumMessage = "DUSUK";
      } else {
        durumMessage = "YUKSEK";
        bgState = "bg-danger";
      }

      this.setState({
        [grafikItemi]: {
          deger: lastItemOfDeger,
          durum: durumMessage,
          background: bgState
        }
      });
    });
  };

  componentDidMount() {
    this.getLastGrafikData("sicaklik");
    this.getLastGrafikData("nem");
    this.getLastGrafikData("gaz");
  }

  componentWillUnmount() {
    grafikData.ref("sicaklik").off();
    grafikData.ref("nem").off();
    grafikData.ref("gaz").off();
  }
}

export default Grafikler;