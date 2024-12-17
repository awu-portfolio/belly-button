// URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data
d3.json(url).then(function(data) {

  // Get names array
  const names = data.names;

  // Select dropdown menu
  const menu = d3.select("select");

  // Append options under dropdown menu
  for (let i=0; i<names.length; i++) {
    let name = names[i];
    menu.append("option").text(name);
  };
});


// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const results = metadata.filter(person => person.id == sample);
    const result = results[0]

    // Select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Append new tags for each key-value in the filtered metadata
    panel.selectAll("h6").data(Object.entries(result)).enter().append("h6")
    .text(d => `${d[0].toUpperCase()}: ${d[1]}`);

  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const results = samples.filter(person => person.id == sample);
    const result = results[0]

    // Otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a bubble chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      },
      hovertemplate: '<b>OTU %{x}</b><br>' +
                     'Count: %{y}<br>' +
                     'Bacteria: %{text}' +
                     '<extra></extra>'
    };

    let bubble_layout = {
      title: {
        text: "Bacteria Cultures Per Sample",
        font: {
          family: "Geneva, Arial, sans-serif",
          size: 24,
          weight: 'bold'
        },
        y: 0.95,
        x: 0.56,          // Adjust this value to match the bar chart title position
        xanchor: 'center',
        yanchor: 'top'
      },
      xaxis: {
        title: "OTU ID",
        titlefont: {
          family: "Geneva, Arial, sans-serif",
          size: 14
        }
      },
      yaxis: {
        title: "Number of Bacteria",
        titlefont: {
          family: "Geneva, Arial, sans-serif",
          size: 14
        }
      },
      height: 500,
      autosize: true,
      font: {
        family: "Geneva, Arial, sans-serif",
        size: 14
      },
      margin: {
        l: 100,
        r: 20,
        t: 40,
        b: 40
      },
      hoverlabel: {
        bgcolor: "white",
        bordercolor: "#888",
        font: { 
          family: "Geneva, Arial, sans-serif",
          size: 12 
        },
        align: 'left',
        borderradius: 8
      },
      modebar: {
        orientation: 'v',
        position: 'right'
      }
    };

    let bubble_chart = [bubble_trace];
    
    // Render the bubble chart
    Plotly.newPlot("bubble", bubble_chart, bubble_layout);

    // Map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a bar chart
    const bar_trace = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      hovertemplate: '<b>%{y}</b><br>' +
                     'Count: %{x}<br>' +
                     'Bacteria: %{text}' +
                     '<extra></extra>'
    };

    let bar_layout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: {
          family: "Geneva, Arial, sans-serif",
          size: 24,
          weight: 'bold'
        },
        y: 0.95,
        x: 0.5,
        xanchor: 'center',
        yanchor: 'top'
      },
      xaxis: {
        title: "Number of Bacteria",
        range: [0, Math.max(...sample_values.slice(0,10)) * 1.1]  // Add some padding to the right
      },
      yaxis: {
        title: "",
        tickmode: "array",
        ticktext: yticks,
        tickvals: [...Array(10).keys()],
        automargin: true
      },
      font: {
        family: "Geneva, Arial, sans-serif"
      },
      hoverlabel: {
        bgcolor: "white",
        bordercolor: "#888",
        font: { 
          family: "Geneva, Arial, sans-serif",
          size: 12 
        },
        align: 'left',
        borderradius: 8
      },
      bargap: 0.3,          // Adjust space between bars
      margin: {
        l: 100,
        r: 20,
        t: 60,
        b: 40
      },
      modebar: {
        orientation: 'v',
        position: 'right'
      }
    }

    let bar_chart = [bar_trace];

    // Render the bar chart
    Plotly.newPlot("bar", bar_chart, bar_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Select the dropdown with id of `#selDataset`
    const menu = d3.select("select")

    // Populate the select options using list of sample names
    for (let i=0; i<names.length; i++) {
      let name = names[i];
      menu.append("option").text(name);
    };

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    let metadata_panel = buildMetadata(names[0]);
    console.log(metadata_panel);
    let charts = buildCharts(names[0]);
    console.log(charts)

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();
