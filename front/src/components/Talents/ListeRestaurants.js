import React, {useState, useEffect} from 'react'
import '../../App.less';
import '../../index.less'
import 'antd/dist/antd.less';
import { Layout, Card, Row, Button, Col, Select, Form, Modal, Rate} from 'antd';
import { PhoneOutlined, MailOutlined, FacebookOutlined, InstagramOutlined, LinkOutlined } from '@ant-design/icons';

import ListeCardsRestaurants from './ListeCardsRestaurants'
import HeaderTalent from '../HeaderTalent'
import HeaderScreen from '../Header'
import HeaderRestaurant from '../HeaderRestaurant'

import { Map, TileLayer, Marker, Popup, Circle } from 'react-leaflet';

import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';

const { Meta } = Card;
const { Option } = Select
const listePrix = [0, 1, 2]
const listeCuisines = ['francaise', 'italienne', 'japonaise', 'chinoise', 'healthy', 'viande', 'poisson', 'pizza', 'burger', 'vegetarienne', 'vegan' ]
const listeTypes = ['touristique', 'quartier', 'jeune', 'agée', 'familiale', 'business']
const listeAmbiances = ['calme', 'animé', 'branché', 'sobre']

const zoneFrance= [
    [ -5.3173828125, 48.458124202908934 ],
    [ 2.1313476562500004, 51.26170001449684 ],
    [ 8.811035156250002, 48.90783374365477 ],
    [ 7.998046875000001, 43.70709714273101 ],
    [ 3.2080078125000004, 42.228008913641865 ],
    [ 1.4941406250000002, 42.293056273848215 ],
    [ -2.0214843750000004, 43.06838615478111 ],
    [ -5.3173828125, 48.458124202908934 ]
  ]

function ListeRestaurants(props){
    const [zone, setZone] = useState(zoneFrance)
    const [listedesRestaurants, setListedesRestaurants] = useState([])
    const [ambianceCochee, setAmbiancecochee] = useState(listeAmbiances)
    const [prixCoche, setPrixcoche] = useState(listePrix)
    const [typeCuisinecochee, setTypeCuisinecochee] = useState(listeCuisines)
    const [typeRestaurantcochee, setTypeRestaurantcochee] = useState(listeTypes)
    const[restoAAfficher, setRestoAAfficher] = useState({})
    const[visible, setVisible] = useState(false)
    const latlngDomicile = [props.adresseToDisplay.coordinates[1], props.adresseToDisplay.coordinates[0]]

    const [isSignIn, setIsSignIn] = useState(props.connectToDisplay.isSignIn)
    const [isTalent, setIsTalent] = useState(props.connectToDisplay.isTalent)
    const [isRestau, setIsRestau] = useState(props.connectToDisplay.isRestau)
    
    const token = props.tokenToDisplay

    function colorationCoeur(liste, whishlist){
        for(var i=0; i<liste.length; i++){
            if(whishlist.includes(liste[i]._id)){
                liste[i].coeur = '#4B6584'
            } else {
                liste[i].coeur = '#a5b1c2'
            }
        }
    }
    
    async function whishlist (id){
        var rawResponse = await fetch(`/talents/whishlist`, {
            method:'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${token}&restaurant=${id}`
        })
        
        var response = await rawResponse.json()
        colorationCoeur(response.liste, response.whishlist)
        setListedesRestaurants(response.liste)   
    }
    
    useEffect(() => {
        async function cherche(){
            if(ambianceCochee==[]){
                setAmbiancecochee(listeAmbiances)
            }
            if(prixCoche ==[]){
                setPrixcoche(listePrix)
            }
            if(listeCuisines == []){
                setTypeCuisinecochee(listeCuisines)
            }
            if(typeRestaurantcochee == []){
                setTypeRestaurantcochee(listeTypes)
            }
           
            var criteres = JSON.stringify({ambiance: ambianceCochee, cuisine: typeCuisinecochee, prix: prixCoche, type:typeRestaurantcochee, zone:zone})
            var rechercheListe = await fetch(`/talents/recherche-liste-restaurants`, {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `token=${token}&restaurant=${criteres}`
            })
            var response = await rechercheListe.json()
            colorationCoeur(response.liste, response.whishlist)
            setListedesRestaurants(response.liste)
        }
        cherche()
    }, [])
    
    useEffect(() => {
        console.log('zone', zone)
        async function cherche(){
            if(ambianceCochee==[]){
                setAmbiancecochee(listeAmbiances)
            }
            if(prixCoche ==[]){
                setPrixcoche(listePrix)
            }
            if(listeCuisines == []){
                setTypeCuisinecochee(listeCuisines)
            }
            if(typeRestaurantcochee == []){
                setTypeRestaurantcochee(listeTypes)
            }
            var criteres = JSON.stringify({ambiance: ambianceCochee, cuisine: typeCuisinecochee, prix: prixCoche, type:typeRestaurantcochee, zone:zone})
            var rechercheListe = await fetch(`/talents/recherche-liste-restaurants`, {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `token=${token}&restaurant=${criteres}`
            })
            var response = await rechercheListe.json()
            colorationCoeur(response.liste, response.whishlist)
            setListedesRestaurants(response.liste)
        }
        cherche()
    }, [ambianceCochee,typeCuisinecochee,typeRestaurantcochee, prixCoche, zone])
    
    const onclick = (resto) => {
        setRestoAAfficher(resto);
        setVisible(true);
    }

    var cuisine = ' '
    if(restoAAfficher.typeOfFood){
        for(var i=0; i<restoAAfficher.typeOfFood.length; i++){
            if(i==restoAAfficher.typeOfFood.length-1){
                cuisine+= restoAAfficher.typeOfFood[i]
            } else {
                cuisine+=restoAAfficher.typeOfFood[i] + ', '
            }
        }
    }
    var clientele = ' '
    if(restoAAfficher.clientele){
        for(var i=0; i<restoAAfficher.clientele.length; i++){
            if(i==restoAAfficher.clientele.length-1){
                clientele+= restoAAfficher.clientele[i]
            } else {
                clientele+=restoAAfficher.clientele[i] + ', '
            }
        }
    }
    var ambiance = ' '
    if(restoAAfficher.typeOfRestaurant){
        for(var i=0; i<restoAAfficher.typeOfRestaurant.length; i++){
            if(i==restoAAfficher.typeOfRestaurant.length-1){
                ambiance+= restoAAfficher.typeOfRestaurant[i]
            } else {
                ambiance+=restoAAfficher.typeOfRestaurant[i] + ', '
            }
        }
    }
    if(restoAAfficher.pricing == 0){
        var prix = ' €'
    } else if(restoAAfficher.pricing == 1){
        var prix = ' €€'
    } else if(restoAAfficher.pricing == 1){
        var prix = ' €€€'
    } else {
        var prix = '--'
    }

    if(!isSignIn){
        var header = <HeaderScreen /> // redirect  plutôt ???
      } else if (isSignIn && isRestau){
        var header = <HeaderRestaurant keyheader='4'/>
      } else if (isSignIn && isTalent){
        var header = <HeaderTalent keyheader='2'/>
      }
      if(!isSignIn){
          return <Redirect to='/'/>
      }else{

      
    return(
      <div >
        
       {header}
        <Row style={{justifyContent:'center', color:'white', fontWeight:'bold', fontSize:'30px', backgroundColor:'#4B6584'}}>Les restaurants inscrits</Row>
        <Modal
            title={<p style={{color:'#4B6584', fontSize:'20px', fontWeight:'bold', margin:'0px'}}>{restoAAfficher.name}</p>}
            centered
            cancelText='Revenir à la liste'
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            width={800}
            style={{
              justifyContent:'center',
              textAlign:'center',
              display: 'inline-flex'
            }
            }
          >
                
                <Card
                    hoverable
                    style={{ width: '80vw' }}
                >
                
                <Meta   
                        description={  
                            <div style={{height:'300px', 
                                        backgroundImage:`url(${restoAAfficher.photo})`, 
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: "cover"}}>          
                            </div>
                        } 
                        />
                </Card>
                <Card
                    hoverable
                    style={{ width: '100%' }}
                >
                
                    <Meta
                        description={  
                            <div>
                                <Row style={{marginTop:'20px'}}>
                                    <Col span={12}>
                                        <div>
                                            <p>{restoAAfficher.adress}</p>
                                            <p style={style.textCard}><PhoneOutlined style={{marginRight:'10px'}}/>{restoAAfficher.phone}</p>
                                            <p style={style.textCard}><MailOutlined style={{marginRight:'10px'}}/> {restoAAfficher.email}</p>
                                            <p style={style.textCard}><LinkOutlined  style={{marginRight:'10px'}}/> {restoAAfficher.website}</p>
                                            <p style={style.textCard2}><FacebookOutlined /> <InstagramOutlined /></p>
                                            
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        
                                        <p style={style.textCard}><strong>Cuisine : </strong>{cuisine}</p> 
                                        <p style={style.textCard}><strong>Gamme de prix : </strong>{prix}</p> 
                                        <p style={style.textCard}><strong>Clientèle : </strong>{clientele}</p> 
                                        <p style={style.textCard}><strong>Ambiance : </strong>{ambiance}</p> 
                                        <p style={{color:"#4B6584", marginTop:'20px', fontWeight:"bold"}}>Note moyenne attribuée par nos talents :</p> 
                                        <p style={style.textCard}><Rate disabled defaultValue={2} />2 (10 votes)</p>
                                    </Col>
                                </Row>
                            </div>
                        } 
                    />
                </Card>
            
        </Modal>

        <Row style={style.row2}>

            <Col span={6}>
                Type d'ambiance :
                <Form.Item >
                    <Select 
                        onChange={(e)=>{setAmbiancecochee(e)}}
                        style={{width:'80%'}}
                        mode='multiple'
                        name={'ambiance'}
                        className="basic-multi-select"
                        classNamePrefix="select">
                    {listeAmbiances.map((e, i)=>{
                        return (<Option key={e + i} value={e}>{e}</Option>)
                    })}
                
                    </Select>
                </Form.Item>
            </Col>

            <Col span={6}>
                Gamme de prix :
                <Form.Item >
                        <Select 
                            onChange={(e)=>setPrixcoche(e)}
                            style={{width:'80%'}}
                            mode='multiple'
                            name={'prix'}
                            className="basic-multi-select"
                            classNamePrefix="select">
                            <Option value={0}>€</Option>
                            <Option value={1}>€€</Option>
                            <Option value={2}>€€€</Option>
                        </Select>
                </Form.Item>
            </Col>

            <Col span={6}>
                Type de cuisine :
                <Form.Item >
                    <Select 
                        onChange={(e)=>setTypeCuisinecochee(e)}
                        style={{width:'80%'}}
                        mode='multiple'
                        name={'cuisine'}
                        className="basic-multi-select"
                        classNamePrefix="select">
                    {listeCuisines.map((e, i)=>{
                        return (<Option key={e + i} value={e}>{e}</Option>)
                    })
                    }
                    </Select>
                </Form.Item>
            </Col>

            <Col span={6}>
                Type de restaurant :
                <Form.Item >
                    <Select 
                        onChange={(e)=>setTypeRestaurantcochee(e)}
                        style={{width:'80%'}}
                        mode='multiple'
                        name={'clientele'}
                        className="basic-multi-select"
                        classNamePrefix="select">
                    {listeTypes.map((e, i)=>{
                        return (<Option key={e + i} value={e}>{e}</Option>)
                    })
                    }
                
                    </Select>
                </Form.Item>
            </Col>
        </Row> 

        <Row style={style.row} >

            <Button onClick={()=>{{ 
                                    setZone(props.profilToDisplay.perimetre);
                                }}
                            } 
                            type="primary"
                            style={{marginLeft:'30px'}}> Afficher les restaurants dans ma zone de recherche </Button>
            
            <Button onClick={()=>{{ 
                                    setTypeRestaurantcochee(listeTypes); 
                                    setAmbiancecochee(listeAmbiances); 
                                    setPrixcoche(listePrix);
                                    setTypeCuisinecochee(listeCuisines);
                                    setZone(zoneFrance);
                                }}
                            } 
                            type="primary"
                            style={{marginLeft:'30px'}}> Afficher tous les restaurants </Button>
        </Row>
         

        <Layout style={{ backgroundColor:'white', padding: '0 24px', minHeight: 280}}>
            <Row >
                <Col span={12} >
                    <Card style={{ border:'none', width: '100%', textAlign:'center', backgroundColor:'#fed330', marginTop:'30px' }}>
                        <div>
                        <Map center={latlngDomicile} zoom={12}>
                            <TileLayer
                                url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z} "
                                attribution='&copy; <a href="http://osm.org/copyright">"OpenStreet"Map</a> contributors'
                                />
                                {/* Affiche un marker à l'adresse de tous les restaurants avec une Popup qui mentionne leurs coordonnées  */}
                                 {listedesRestaurants.map((restaurant,i)=>{ 
                                    //  if(restaurant.adresselgtlat.coordinates && restaurant.adresselgtlat.coordinates){
                                        return (<Marker position={[restaurant.adresselgtlat.coordinates[1], restaurant.adresselgtlat.coordinates[0]]}>
                                                    <Popup ><div onClick={()=> onclick(restaurant)}>
                                                            <strong>{restaurant.name}</strong> <br/>
                                                                {restaurant.adress}<br/>
                                                                {restaurant.phone} / {restaurant.email} <br/>
                                                                {restaurant.email}<br/>
                                                            </div> 
                                                    </Popup>
                                                </Marker>)
                                        //  }
                                    })
                                }
                                <Circle 
                                    center={latlngDomicile}
                                    color="red" 
                                    fillcolor='red'
                                    radius={200}><Popup>Mon domicile</Popup></Circle>
                        </Map>
                        </div>
                    </Card>
                </Col>

                <Col span={12} style={{margin:'30px 0px'}}>
                    {/* Composant liste des restaurants : */}
                    <ListeCardsRestaurants liste={listedesRestaurants} onclick={onclick} whishlist={whishlist}/>
                </Col>
            </Row>
        </Layout>
      </div>
    )
}
}

const style= {
    row: {
        backgroundColor:"#4B6584", 
        justifyContent:"center", 
        textAlign:'center', 
        padding:'10px',
        color:'white',
        width:'100%',
    },
    row2:{
        paddingTop: '30px',
        backgroundColor:"#4B6584", 
        justifyContent:"center", 
        textAlign:'center', 
        color:'white',
        width:'100%',
    },
    textCard:{
        color:"#4B6584",
        margin:'0px 20px'
    },
    textCard2:{
        color:"#4B6584",
        margin:'0px',
        fontSize:'20px',
        margin:'0px 20px'
    }
}
  
function mapStateToProps(state) {
return {tokenToDisplay: state.token, connectToDisplay:state.isConnect ,adresseToDisplay: state.adresse, profilToDisplay: state.profil, zoneToDisplay: state.zone}
}

export default connect(
    mapStateToProps, 
    null
)(ListeRestaurants);