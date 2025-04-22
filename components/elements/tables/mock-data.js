export const data = [
	{
		code_isin: "MA0000012296",
		instrument_label: "AFMA",
		secteur: "ACTIONS 1ERE LIGNE",
		compartiment: "Pricipale B",
		tirre_num: 3437500,
	},
	{
		code_isin: "MA0000012281",
		instrument_label: "-",
		secteur: "ACTIONS 1ERE LIGNE",
		compartiment: "Pricipale A",
		tirre_num: 863930,
	},
	{
		code_isin: "MA0000010951",
		instrument_label: "AFMA",
		secteur: "ALUMINIUM DU MAROC",
		compartiment: "Pricipale C",
		tirre_num: 76799,
	},
	{
		code_isin: "MA0000012296",
		instrument_label: "AFMA",
		secteur: "ACTIONS 1ERE LIGNE",
		compartiment: "-",
		tirre_num: 3437500,
	},
	{
		code_isin: "MA0000012281",
		instrument_label: "ARFIQUIA GAZ",
		secteur: "ACTIONS 1ERE LIGNE",
		compartiment: "-",
		tirre_num: 863930,
	},
	{
		code_isin: "MA0000010951",
		instrument_label: "AFMA",
		secteur: "ALUMINIUM DU MAROC",
		compartiment: "Pricipale C",
		tirre_num: 76799,
	},
	{
		code_isin: "MA0000012296",
		instrument_label: "AFMA",
		secteur: "ACTIONS 1ERE LIGNE",
		compartiment: "Pricipale B",
		tirre_num: 3437500,
	},
	{
		code_isin: "MA0000012281",
		instrument_label: "ARFIQUIA GAZ",
		secteur: "ACTIONS 1ERE LIGNE",
		compartiment: "Pricipale A",
		tirre_num: 863930,
	},
	{
		code_isin: "MA0000010951",
		instrument_label: "AFMA",
		secteur: "ALUMINIUM DU MAROC",
		compartiment: "Pricipale C",
		tirre_num: "-",
	},
]

export const column = [
	{ heading: "Code ISIN", value: "code_isin" },
	{ heading: "Libelle instrument", value: "instrument_label", sortKey: "title" },
	{
		heading: "Secteur/Catégorie",
		value: "secteur",
		sortKey: "field_secteur.name",
	},
	{ heading: "Compartiment", value: "compartiment", sortKey: "compartiment" },
	{ heading: "Nombre de tirre formant le capital", value: "tirre_num" },
]

export const columnToggle = [
	{ heading: "Code ISIN", value: "code_isin" },
	{ heading: "Libelle instrument", value: "instrument_label" },
	{ heading: "Secteur/Catégorie", value: "secteur" },
	{ heading: "Compartiment", value: "compartiment" },
	{ heading: "Nombre de tirre formant le capital", value: "tirre_num" },
	{ heading: "", value: "" },
]

// This is the column footer
export const columnFooter = [
	{
		value: "lorem ipsum",
		colSpan: 2,
	},
	{
		value: "lorem ipsum",
		colSpan: 1,
		className: "text-left",
	},

	{
		value: "lorem ipsum",
		colSpan: 1,
		className: "text-left",
	},
	{
		colSpan: 2,
		value: "lorem ipsum",
		className: "text-left",
	},
]
