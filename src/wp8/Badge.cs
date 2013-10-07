/**
 *  Badge.cs
 *  Cordova Badge Plugin
 *
 *  Created by Sebastian Katzer (github.com/katzer) on 07/10/2013.
 *  Copyright 2013 Sebastian Katzer. All rights reserved.
 *  GPL v2 licensed
 */

using System;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Devices;
using System.Runtime.Serialization;
using System.Threading;
using System.Windows.Resources;
using Microsoft.Phone.Controls;
using System.Diagnostics;

using WPCordovaClassLib.Cordova;
using WPCordovaClassLib.Cordova.Commands;
using WPCordovaClassLib.Cordova.JSON;


namespace APPPlant.Cordova.Plugin
{
    public class Badge : BaseCommand
    {
        public void setBadge (string badgeNumber)
        {
            // Application Tile is always the first Tile, even if it is not pinned to Start.
            ShellTile TileToFind = ShellTile.ActiveTiles.First();

            // Application should always be found
            if (TileToFind != null)
            {
                string[] args = JSON.JsonHelper.Deserialize<string[]>(badgeNumber);
                int count     = 0;

                try
                {
                    count = int.Parse(args[0]);
                }
                catch (FormatException) {};

                // Set the properties to update for the Application Tile
                // Empty strings for the text values and URIs will result in the property being cleared.
                StandardTileData NewTileData = new StandardTileData
                {
                    Count = count
                };

                // Update the Application Tile
                TileToFind.Update(NewTileData);
            }
        }
    }
}
