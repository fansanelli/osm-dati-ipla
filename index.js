const centroid = require('./node_modules/@turf/centroid/dist/js/index')
const length = require('./node_modules/@turf/length/dist/js/index')

const ipla = JSON.parse(require('fs').readFileSync('./export_PErcorsi_CN.geojson', 'utf8'))
const osm = JSON.parse(require('fs').readFileSync('./export_OSM.geojson', 'utf8'))

const relations = {}
osm.features.forEach(feature => {
	const id = feature.properties['@id']
	const refRei = feature.properties['ref:REI']
	const surveyDate = feature.properties['survey:date']
	const featureCentroid = centroid.default(feature.geometry).geometry.coordinates
	const featureLength = (length.default(feature.geometry, { unit: 'kilometers' }) * 1000).toFixed(2)
	if (refRei)
		relations[refRei] = { id, surveyDate, featureCentroid, featureLength }
})

console.log('ref:REI;lat_cent;long_cent;len;survey;osm_id;osm_survey_date;osm_lat_cent;osm_lon_cent;osm_len')
ipla.features.forEach(feature => {
	const refRei = feature.properties.gis_key
	const survey = feature.properties.orig === 'R'
	const featureCentroid = centroid.default(feature.geometry).geometry.coordinates
	const featureLength = (length.default(feature.geometry, { unit: 'kilometers' }) * 1000).toFixed(2)
	let osmId = ''
	let osmSurveyDate = ''
	let osmFeatureCentroid = ['', '']
	let osmFeatureLength = ''
	if (relations[refRei]) {
		osmId = relations[refRei].id
		osmSurveyDate = relations[refRei].surveyDate
		osmFeatureCentroid = relations[refRei].featureCentroid
		osmFeatureLength = relations[refRei].featureLength
	}
	console.log(refRei + ';' + featureCentroid[0] + ';' + featureCentroid[1] + ';' + featureLength + ';' + survey + ';' + osmId + ';' + osmSurveyDate + ';' + osmFeatureCentroid[0] + ';' + osmFeatureCentroid[1] + ';' + osmFeatureLength)
	delete relations[refRei]
})

console.log('\n\nmissing in IPLA:', Object.keys(relations))

