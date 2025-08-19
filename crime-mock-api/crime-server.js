const http = require('http');


console.log('Starting crime data server...');



const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
  console.log(`Request headers:`, req.headers);

  const crimeData = Math.random() > 0.5 ? {
    "Overall": {
      "Zipcode": "94109",
      "Overall Crime Grade": "F",
      "Violent Crime Grade": "F",
      "Property Crime Grade": "F",
      "Other Crime Grade": "D",
      "Fact": "A crime occurs every 1 hour 13 minutes (on average) in 94109.",
      "Risk": "300%",
      "Risk Detail": "Your home is 300% more likely to be robbed with no home security system."
    },
    "Crime BreakDown": [
      {
        "0": {
          "Total Violent Crime": "15.55",
          "Total Violent Crime Score": "(F)"
        },
        "Violent Crime Rates": {
          "Assault": "10.79",
          "Robbery": "4.241",
          "Rape": "0.4693",
          "Murder": "0.0512"
        }
      },
      {
        "0": {
          "Total Property Crime": "72.44",
          "Total Property Crime Score": "(F)"
        },
        "Property Crime Rates": {
          "Theft": "53.50",
          "Vehicle Theft": "3.201",
          "Burglary": "11.97",
          "Arson": "3.769"
        }
      },
      {
        "0": {
          "Total Other Rate": "34.39",
          "Total Other Score": "(D)"
        },
        "Other Crime Rates": {
          "Kidnapping": "0.4706",
          "Drug Crimes": "25.36",
          "Vandalism": "7.459",
          "Identity Theft": "1.050",
          "Animal Cruelty": "0.0542"
        }
      }
    ],
    "Crime Rates Nearby": [
      {
        "Nearby Zip": "94108, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94102, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94133, CA",
        "Overall Crime Grade": "D-",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94104, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94115, CA",
        "Overall Crime Grade": "C+",
        "Violent Crime Grade": "D-",
        "Property Crime Grade": "C-"
      },
      {
        "Nearby Zip": "94123, CA",
        "Overall Crime Grade": "C+",
        "Violent Crime Grade": "D-",
        "Property Crime Grade": "D+"
      },
      {
        "Nearby Zip": "94111, CA",
        "Overall Crime Grade": "D-",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "D-"
      },
      {
        "Nearby Zip": "94103, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94105, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94117, CA",
        "Overall Crime Grade": "B",
        "Violent Crime Grade": "D",
        "Property Crime Grade": "C"
      }
    ],
    "Similar Population Crime Rates": [
      {
        "Similar Zip": "22003, VA",
        "Overall Crime Grade": "A-",
        "Violent Crime Grade": "A+",
        "Property Crime Grade": "A+"
      },
      {
        "Similar Zip": "30518, GA",
        "Overall Crime Grade": "A-",
        "Violent Crime Grade": "A+",
        "Property Crime Grade": "A+"
      },
      {
        "Similar Zip": "89123, NV",
        "Overall Crime Grade": "B-",
        "Violent Crime Grade": "B+",
        "Property Crime Grade": "B+"
      },
      {
        "Similar Zip": "28227, NC",
        "Overall Crime Grade": "A-",
        "Violent Crime Grade": "B-",
        "Property Crime Grade": "B-"
      },
      {
        "Similar Zip": "80022, CO",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Similar Zip": "27616, NC",
        "Overall Crime Grade": "C-",
        "Violent Crime Grade": "A-",
        "Property Crime Grade": "A-"
      },
      {
        "Similar Zip": "27284, NC",
        "Overall Crime Grade": "A-",
        "Violent Crime Grade": "B",
        "Property Crime Grade": "B"
      },
      {
        "Similar Zip": "23452, VA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "B+",
        "Property Crime Grade": "B+"
      },
      {
        "Similar Zip": "21222, MD",
        "Overall Crime Grade": "D",
        "Violent Crime Grade": "D+",
        "Property Crime Grade": "D+"
      },
      {
        "Similar Zip": "19446, PA",
        "Overall Crime Grade": "A",
        "Violent Crime Grade": "B",
        "Property Crime Grade": "B"
      }
    ],
    "success": true,
    "status code": 200
  } : {
    "Overall": {
      "Zipcode": "94109",
      "Overall Crime Grade": "A",
      "Violent Crime Grade": "B",
      "Property Crime Grade": "A",
      "Other Crime Grade": "B",
      "Fact": "A crime occurs every 1 month (on average) in 94109.",
      "Risk": "10%",
      "Risk Detail": "Your home is 10% more likely to be robbed with no home security system."
    },
    "Crime Rates Nearby": [
      {
        "Nearby Zip": "94108, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94102, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94133, CA",
        "Overall Crime Grade": "D-",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94104, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94115, CA",
        "Overall Crime Grade": "C+",
        "Violent Crime Grade": "D-",
        "Property Crime Grade": "C-"
      },
      {
        "Nearby Zip": "94123, CA",
        "Overall Crime Grade": "C+",
        "Violent Crime Grade": "D-",
        "Property Crime Grade": "D+"
      },
      {
        "Nearby Zip": "94111, CA",
        "Overall Crime Grade": "D-",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "D-"
      },
      {
        "Nearby Zip": "94103, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94105, CA",
        "Overall Crime Grade": "F",
        "Violent Crime Grade": "F",
        "Property Crime Grade": "F"
      },
      {
        "Nearby Zip": "94117, CA",
        "Overall Crime Grade": "B",
        "Violent Crime Grade": "D",
        "Property Crime Grade": "C"
      }
    ],
    "success": true,
    "status code": 200
  };
  
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  console.log('Sending crime data response...');
  res.end(JSON.stringify(crimeData, null, 2));
  console.log(`[${new Date().toISOString()}] Response sent successfully`);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Crime data server started successfully`);
  console.log(`Server running on http://localhost:${PORT}`);

});

// Add error handling with logging
server.on('error', (error) => {
  console.error(`[${new Date().toISOString()}] Server error:`, error);
});

process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] Received SIGINT, shutting down gracefully...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed successfully`);
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] Received SIGTERM, shutting down gracefully...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed successfully`);
    process.exit(0);
  });
});
