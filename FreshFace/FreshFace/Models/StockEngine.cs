#region Using

using System;
using System.Text;
using System.Net;
using System.IO;
using System.Timers;
using System.Globalization;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

#endregion
namespace FreshFace.models {
/// <summary>
/// Provides near real-time stock quotes.
    /// From http://madskristensen.net/post/Stock-quote-class-in-C.aspx
/// </summary>
public class StockEngine
{

  #region Constructors

  /// <summary>
  /// Create an instance of StockEngine.
  /// </summary>
  /// <param name="symbol">The symbol of the quote to retrieve.</param>
  public StockEngine(string symbol)
  {
    Init(symbol, false, 60000);
  }

  /// <summary>
  /// Create an instance of StockEngine.
  /// </summary>
  /// <param name="symbol">The symbol of the quote to retrieve.</param>
  /// <param name="autoUpdate">Specify whether or not to automatically update the quote.</param>
  public StockEngine(string symbol, bool autoUpdate)
  {
    Init(symbol, autoUpdate, 60000);
  }

  /// <summary>
  /// Create an instance of StockEngine.
  /// </summary>
  /// <param name="symbol">The symbol of the quote to retrieve.</param>
  /// <param name="autoUpdate">Specify whether or not to automatically update the quote.</param>
  /// <param name="updateInterval">Specify at what interval to update. In milliseconds.</param>
  public StockEngine(string symbol, bool autoUpdate, int updateInterval)
  {
    Init(symbol, autoUpdate, updateInterval);
  }

  /// <summary>
  /// Initializes the object with data from the constructors.
  /// </summary>
  private void Init(string symbol, bool autoUpdate, int updateInterval)
  {
    UpdateInterval = updateInterval;
    Symbol = symbol;
    InitializeTimer();
    AutoUpdate = autoUpdate;
  }

  #endregion

  #region Properties

  private string _Symbol;
  /// <summary>
  /// Gets or sets the symbol of the stock to retrieve.
  /// </summary>
  public string Symbol
  {
    get { return _Symbol; }
    set
    {
      if (String.IsNullOrEmpty(value) || value.Length > 5)
        throw new ArgumentException("The stock symbol must be a valid 3-5 character string.");

      _Symbol = value;
    }
  }

  private bool _AutoUpdate;
  /// <summary>
  /// Gets or sets whether or not to automatically update the quote.
  /// </summary>
  public bool AutoUpdate
  {
    get { return _AutoUpdate; }
    set
    {
      _Timer.Enabled = value;
      _AutoUpdate = value;
    }
  }

  private int _UpdateInterval;
  /// <summary>
  /// Gets or sets at what interval to update. In milliseconds.
  /// </summary>
  public int UpdateInterval
  {
    get { return _UpdateInterval; }
    set
    {
      //if (value < 60000)
      //  throw new ArgumentException("The update interval must be at least than 60.000");

      _UpdateInterval = value;
      _Timer.Interval = value;
    }
  }

  private double _Value;
  /// <summary>
  /// Gets the stock quote that corresponds to the symbol specified.
  /// </summary>
  public double Value
  {
    get { return _Value; }
  }

  private double _ChangeValue;
  /// <summary>
  /// Gets the stock quote that corresponds to the symbol specified.
  /// </summary>
  public double ChangeValue
  {
      get { return _ChangeValue; }
  }

  private DateTime _LastUpdated;
  /// <summary>
  /// Gets the time of the last retrieval.
  /// </summary>
  public DateTime LastUpdated
  {
    get { return _LastUpdated; }
  }

  #endregion

  #region Methods

  /// <summary>
  /// Retrieves the stock quote from the Internet.
  /// </summary>
  /// <param name="symbol">Specify the symbol of the stock to retrieve.</param>
  /// <returns>The value of the stock quote.</returns>
  public static StockEngine Execute(string symbol)
  {
    StockEngine engine = new StockEngine(symbol, false);
    HttpWebRequest request = engine.CreateRequest();
    engine.ProcessResponse(request);
    return engine;
  }

  /// <summary>
  /// Creates a web request to Yahoo finacial service.
  /// </summary>
  private HttpWebRequest CreateRequest()
  {
    string serverURL = "http://download.finance.yahoo.com/d/quotes.csv?s=" + Symbol + "&f=sl1d1t1c1ohgv&e=.csv";
    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(serverURL);
    return request;
  }

  /// <summary>
  /// Retrieves the response from the web request.
  /// </summary>
  /// <param name="request">The request from which to get the response from.</param>
  private void ProcessResponse(HttpWebRequest request)
  {
    try
    {
      using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
      {
        using (StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.ASCII))
        {
          string html = reader.ReadToEnd();
          ParseQuote(html);
        }
      }
    }
    catch (WebException)
    {
      OnError();
    }
  }

  /// <summary>
  /// Parses the retrieved HTML document in order 
  /// to substract the right stock quote.
  /// </summary>
  /// <param name="html">The HTML to parse.</param>
  private void ParseQuote(string html)
  {
    //if (html.Contains("N/A"))
      //throw new ArgumentException("The symbol '" + Symbol + "' does not exist.");

    string[] args = html.Split(',');
    CultureInfo format = new CultureInfo("en-US");
    DateTime date = DateTime.Parse(args[2].Replace("\"", string.Empty), format);
    DateTime time = DateTime.Parse(args[3].Replace("\"", string.Empty), format);

    _Value = double.Parse(args[1], format);
    _ChangeValue = double.Parse(args[4], format);
    _LastUpdated = date.Add(new TimeSpan(time.Hour, time.Minute, time.Second));
    OnUpdated();
  }

  #endregion

  #region Auto update

  /// <summary>
  /// The timer that controls the automatic updates.
  /// </summary>
  private readonly Timer _Timer = new Timer();

  /// <summary>
  /// Prepares the timer for automatic updates.
  /// </summary>
  private void InitializeTimer()
  {
    _Timer.Elapsed += delegate { BeginGetQuote(); };
    _Timer.Interval = _UpdateInterval;
  }

  /// <summary>
  /// Starts the asynchonous data retrieval.
  /// </summary>
  private void BeginGetQuote()
  {
    _Timer.Stop();
    HttpWebRequest request = CreateRequest();
    request.BeginGetResponse(EndGetQuote, request);
  }

  /// <summary>
  /// Ends the asynchonous data retrieval.
  /// </summary>
  private void EndGetQuote(IAsyncResult stateInfo)
  {
    HttpWebRequest request = stateInfo.AsyncState as HttpWebRequest;
    ProcessResponse(request);
    _Timer.Start();
  }

  #endregion

  #region Events

  /// <summary>
  /// Occurs when the quote has been updated.
  /// </summary>
  public event EventHandler<EventArgs> Updated;
  protected virtual void OnUpdated()
  {
    if (Updated != null)
    {
      Updated(this, new EventArgs());
    }
  }

  /// <summary>
  /// Occurs when the the stock quote retrievel fails.
  /// </summary>
  public event EventHandler<EventArgs> Error;
  protected virtual void OnError()
  {
    if (Error != null)
    {
      Error(this, new EventArgs());
    }
  }

  #endregion

}
}
