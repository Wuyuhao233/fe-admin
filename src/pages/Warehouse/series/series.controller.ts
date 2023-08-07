import { ISeries, ISeriesDto } from '@/declare/warehouse';
import { http } from '@/request/http';
class SeriesController {
  getSeriesList(params: ISeriesDto) {
    return http.get<ISeries[]>('/series/getSeriesList', params);
  }
  getSeriesById(id: string) {
    return http.get<ISeries>('/series/getSeries', { id });
  }
  deleteSeriesById(id: string) {
    return http.delete('/series/deleteSeries', { id });
  }
  updateSeries(series: ISeries) {
    return http.post('/series/updateSeries', series);
  }
  addSeries(series: ISeries) {
    return http.post('/series/addSeries', series);
  }
}
export default new SeriesController();
