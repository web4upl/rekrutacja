import React from "react";
var _ = require( 'lodash' ); 

class AppZdanie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      wybrani: [],
      szukaj: ''
    };

    this.handleWybrani = this.handleWybrani.bind(this);
    this.handleSzukaj = this.handleSzukaj.bind(this);
  }

  componentDidMount() {
       
      fetch("https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json")
      .then(res => res.json())
      .then(result => {
          this.setState({
            isLoaded: true,
            items: result
          });

        })
      .catch(error => 
            this.setState({
              isLoaded: true,
              error: error
        })
      );
  }

  handleWybrani(e) {
      let aktLista = this.state.wybrani; 
      let stan = e.target.checked;
      let wartosc = e.target.value;

      if ( stan ) {
        this.setState({
          wybrani: [...this.state.wybrani,wartosc] 
        });
      }
      else {
        let index = aktLista.indexOf( wartosc );
        aktLista.splice( index,1 );
        this.setState({
          wybrani: aktLista
        });
      }
  }

  handleSzukaj(e) {
    this.setState({
      szukaj: e.target.value
    });
  }

  render() {
    const { error, isLoaded, items, wybrani, szukaj } = this.state;
    
    console.log( wybrani );
    console.log( szukaj );

    if (error) {
      return <div className="err">Error: {error.message}</div>;
    } 
    else if (!isLoaded) {
      return <div>Loading...</div>;
    } 
    else {

      const wynikiSzukaj = [];
      items.forEach( kontakt => {

        let porownaj = kontakt.last_name.substring(0, szukaj.length ).toLowerCase(); 
        let porownaj_imie = kontakt.first_name.substring(0, szukaj.length ).toLowerCase(); 

        if ( porownaj !== szukaj.toLowerCase() && porownaj_imie !== szukaj.toLowerCase()  ) {
          return; 
        } 
        else {
          wynikiSzukaj.push(kontakt);
        }

      });

      var sortArr = _.sortBy( wynikiSzukaj, 'last_name', function(n) {
        return Math.sin(n); 
      });



      const wiersze = sortArr.map( item => {
        var avatar = item.avatar !== null ? <img src={item.avatar} /> : '-'; 

        return (
          <label key={item.id}>
            <div className="kontakt">
            <div>{avatar}</div>
              <div>{item.last_name} {item.first_name}</div>
              <div>{item.email}</div>
              <div>
                <input 
                  type="checkbox"
                  name={item.id}
                  value={item.id}
                  onChange={this.handleWybrani}
                />
              </div>
            </div>
          </label>
        )
      });

      return (
        <div>
          <div>Wybranych: {this.state.wybrani.length}</div>
          <div>Szukaj: <input name="szukaj" onChange={this.handleSzukaj} /></div>
          <br />
          {wiersze}
        </div>
      );
    }
  }
}


export default AppZdanie; 